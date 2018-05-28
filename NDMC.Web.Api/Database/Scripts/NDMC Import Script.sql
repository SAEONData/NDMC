--TypeSource--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[TypeSources]) = 0)
BEGIN
	INSERT INTO
		[NDMC_TEST].[dbo].[TypeSources]
		(
			TypeSourceName
		)
	SELECT
		TS1.TypeSource
	FROM
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - TypeSource] TS1
END

--TypeEvent--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[TypeEvents]) = 0)
BEGIN
	INSERT INTO
		[NDMC_TEST].[dbo].[TypeEvents]
		(
			TypeEventName
		)
	SELECT
		DISTINCT EV1.TypeEvent
	FROM
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - Event] EV1
	WHERE
		EV1.TypeEvent IS NOT NULL
END

--Events--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[Events]) = 0)
BEGIN
	INSERT INTO
		[NDMC_TEST].[dbo].[Events]
		(
			StartDate,
			EndDate,
			Location_WKT,
			TypeEventId,
			TypeSourceId
		)
	SELECT
		DATEDIFF(second,{d '1970-01-01'},EV1.[StartDate]),
		DATEDIFF(second,{d '1970-01-01'},EV1.[EndDate]),
		EV1.[Location],
		(SELECT TE.TypeEventId FROM [NDMC_TEST].[dbo].[TypeEvents] TE WHERE TE.TypeEventName = EV1.TypeEvent) as TypeEventId,
		EV1.TypeSource AS TypeSourceId
	FROM
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - Event] EV1
END

--DeclaredEvents--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[DeclaredEvents]) = 0)
BEGIN
	INSERT INTO
		[NDMC_TEST].[dbo].[DeclaredEvents]
		(
			EventId,
			DeclaredDate
		)
	SELECT
		DE.ID_Event,
		DATEDIFF(second,{d '1970-01-01'},DE.DeclaredDate)
	FROM
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - DeclaredEvent] DE
END

--TypeMitigation--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[TypeMitigations]) = 0)
BEGIN
	INSERT INTO
		[NDMC_TEST].[dbo].[TypeMitigations]
		(
			TypeMitigationName,
			UnitOfMeasure
		)
	SELECT 
		[TypeMitigation],
		[UnitofMeasure]
	FROM
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - TypeMitigation]
END

--Departments--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[Departments]) = 0)
BEGIN
	INSERT INTO
		[NDMC_TEST].[dbo].[Departments]
		(
			DepartmentName
		)
	SELECT DISTINCT
		[Department]
	FROM 
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - Mitigation] MI
	WHERE
		MI.Department IS NOT NULL
END

--Mitigations--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[Mitigations]) = 0)
BEGIN
	INSERT INTO
		[NDMC_TEST].[dbo].[Mitigations]
		(
			[Date],
			[Value],
			DepartmentId,
			EventId,
			TypeMitigationId
		)
	SELECT
		MI.[Date],
		TRY_CONVERT (float, MI.[Value]) AS [Value], 
		DP.DepartmentId,
		MI.[ID_Event],
		MI.[ID_TypeMitigation]
	FROM
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - Mitigation] MI
	LEFT OUTER JOIN
		[NDMC_TEST].[dbo].[Departments] DP
		ON DP.DepartmentName = MI.Department
END

--TypeImpacts--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[TypeImpacts]) = 0)
BEGIN
	--Data--
	INSERT INTO
		[NDMC_TEST].[dbo].[TypeImpacts]
		(
			TypeImpactName,
			UnitOfMeasure
		)
	SELECT
		TI.TypeImpact,
		TI.UnitofMeasure
	FROM
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - TypeImpact] TI
	WHERE
		TI.TypeImpact <> ''

	--Parents--
	UPDATE
		TI
	SET
		TI.ParentTypeImpactId = TI4.TypeImpactId
	FROM
		[NDMC_TEST].[dbo].[TypeImpacts] TI
	INNER JOIN
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - TypeImpact] TI2
		ON TI2.TypeImpact = TI.TypeImpactName
		AND TI2.UnitofMeasure = TI.UnitOfMeasure
	LEFT OUTER JOIN
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - TypeImpact] TI3
		ON TI3.ID_TypeImpact = TI2.ID_P_TypeImpact
	LEFT OUTER JOIN
		[NDMC_TEST].[dbo].[TypeImpacts] TI4
		ON TI4.TypeImpactName = TI3.TypeImpact
		AND TI4.UnitOfMeasure = TI3.UnitofMeasure
END

--EventImpacts--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[EventImpacts]) = 0)
BEGIN
	INSERT INTO
		[NDMC_TEST].[dbo].[EventImpacts]
		(
			Measure,
			EventId,
			TypeImpactId
		)
	SELECT
		TRY_CONVERT (float, EI.Measure) AS [Measure], 
		EI.ID_Event,
		TI2.TypeImpactId
	FROM
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - EventImpact] EI
	INNER JOIN
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - TypeImpact] TI
		ON TI.ID_TypeImpact = EI.ID_TypeImpact
	INNER JOIN
		[NDMC_TEST].[dbo].[TypeImpacts] TI2
		ON TI2.TypeImpactName = TI.TypeImpact
		AND TI2.UnitOfMeasure = TI.UnitofMeasure
END

--RegionTypes--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[RegionTypes]) = 0)
BEGIN
	INSERT INTO
		[NDMC_TEST].[dbo].[RegionTypes]
		(
			RegionTypeName
		)
	SELECT DISTINCT
		R.RegionType
	FROM
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - Region] R
END

--Regions--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[Regions]) = 0)
BEGIN
	INSERT INTO
		[NDMC_TEST].[dbo].[Regions]
		(
			RegionName,
			RegionTypeId
		)
	SELECT
		R.Region,
		RT.RegionTypeId
	FROM
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - Region] R
	INNER JOIN
		[NDMC_TEST].[dbo].[RegionTypes] RT
		ON RT.RegionTypeName = R.RegionType

	UPDATE
		R
	SET
		R.ParentRegionId = R4.RegionId
	FROM
		[NDMC_TEST].[dbo].[Regions] R
	INNER JOIN
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - Region] R2
		ON R.RegionName = R2.Region
	LEFT OUTER JOIN
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - Region] R3
		ON R3.ID_Region = R2.ParentRegion
	LEFT OUTER JOIN
		[NDMC_TEST].[dbo].[Regions] R4
		ON R4.RegionName = R3.Region
END

--EventRegion--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[EventRegions]) = 0)
BEGIN
	INSERT INTO
		[NDMC_TEST].[dbo].[EventRegions]
		(
			EventId,
			RegionId
		)
	SELECT
		ER.ID_Event,
		R2.RegionId
	FROM
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - EventRegion] ER
	INNER JOIN
		[NDMC_ImportData].[dbo].[Normalized Declared Disasters - Region] R
		ON R.ID_Region = ER.RegionID
	INNER JOIN
		[NDMC_TEST].[dbo].[Regions] R2
		ON R2.RegionName = R.Region
END