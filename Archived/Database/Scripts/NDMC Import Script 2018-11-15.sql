--TypeSource--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[TypeSources]) = 0)
BEGIN
	SET IDENTITY_INSERT [NDMC_TEST].[dbo].[TypeSources] ON

	INSERT INTO
		[NDMC_TEST].[dbo].[TypeSources]
		(
			[TypeSourceId],
			[TypeSourceName]
		)
	SELECT
		TS1.[ID_TypeSource],
		TS1.[TypeSource]
	FROM
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - TypeSource] TS1

	SET IDENTITY_INSERT [NDMC_TEST].[dbo].[TypeSources] OFF
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
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - Event] EV1
	WHERE
		EV1.TypeEvent IS NOT NULL
END

--Events--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[Events]) = 0)
BEGIN
	SET IDENTITY_INSERT [NDMC_TEST].[dbo].[Events] ON

	INSERT INTO
		[NDMC_TEST].[dbo].[Events]
		(
			EventId,
			StartDate,
			EndDate,
			Location_WKT,
			TypeEventId,
			TypeSourceId
		)
	SELECT
		EV1.ID_EVENT,
		CASE EV1.[StartDate]
			WHEN '' THEN NULL
			ELSE DATEDIFF_BIG(second,{d '1970-01-01'},[StartDate])
		END,
		CASE EV1.[EndDate]
			WHEN '' THEN NULL
			ELSE DATEDIFF_BIG(second,{d '1970-01-01'},[EndDate])
		END,
		EV1.[Location],
		(SELECT TE.TypeEventId FROM [NDMC_TEST].[dbo].[TypeEvents] TE WHERE TE.TypeEventName = EV1.TypeEvent) as TypeEventId,
		EV1.TypeSource AS TypeSourceId
	FROM
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - Event] EV1

	SET IDENTITY_INSERT [NDMC_TEST].[dbo].[Events] OFF
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
		CASE DE.DeclaredDate
			WHEN '' THEN NULL
			ELSE DATEDIFF_BIG(second,{d '1970-01-01'},DE.DeclaredDate)
		END
	FROM
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - DeclaredEvent] DE
END

--TypeMitigation--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[TypeMitigations]) = 0)
BEGIN
	SET IDENTITY_INSERT [NDMC_TEST].[dbo].[TypeMitigations] ON

	INSERT INTO
		[NDMC_TEST].[dbo].[TypeMitigations]
		(
			TypeMitigationId,
			TypeMitigationName,
			UnitOfMeasure
		)
	SELECT
		[ID_TypeMitigation],
		[TypeMitigation],
		[UnitofMeasure]
	FROM
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - TypeMitigation]

	SET IDENTITY_INSERT [NDMC_TEST].[dbo].[TypeMitigations] OFF
END

--Mitigations--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[Mitigations]) = 0)
BEGIN
	INSERT INTO
		[NDMC_TEST].[dbo].[Mitigations]
		(
			[Date],
			[Value],
			EventId,
			TypeMitigationId
		)
	SELECT
		MI.[Date],
		TRY_CONVERT (float, MI.[Value]) AS [Value], 
		MI.[ID_Event],
		MI.[ID_TypeMitigation]
	FROM
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - Mitigation] MI
END

--TypeImpacts--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[TypeImpacts]) = 0)
BEGIN
	SET IDENTITY_INSERT [NDMC_TEST].[dbo].[TypeImpacts] ON

	--Data--
	INSERT INTO
		[NDMC_TEST].[dbo].[TypeImpacts]
		(
			TypeImpactId,
			TypeImpactName,
			UnitOfMeasure
		)
	SELECT
		TI.ID_TypeImpact,
		TI.TypeImpact,
		TI.UnitofMeasure
	FROM
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - TypeImpact] TI
	WHERE
		TI.TypeImpact <> ''

	SET IDENTITY_INSERT [NDMC_TEST].[dbo].[TypeImpacts] OFF
	
	--Parents--
	UPDATE
		TI
	SET
		TI.ParentTypeImpactId = TI4.TypeImpactId
	FROM
		[NDMC_TEST].[dbo].[TypeImpacts] TI
	INNER JOIN
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - TypeImpact] TI2
		ON TI2.TypeImpact = TI.TypeImpactName
		AND TI2.UnitofMeasure = TI.UnitOfMeasure
	LEFT OUTER JOIN
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - TypeImpact] TI3
		ON TI3.ID_TypeImpact = TI2.ID_P_TypeImpact
	LEFT OUTER JOIN
		[NDMC_TEST].[dbo].[TypeImpacts] TI4
		ON TI4.TypeImpactName = TI3.TypeImpact
		AND TI4.UnitOfMeasure = TI3.UnitofMeasure
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
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - Region] R
END

--Regions--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[Regions]) = 0)
BEGIN
	SET IDENTITY_INSERT [NDMC_TEST].[dbo].[Regions] ON

	INSERT INTO
		[NDMC_TEST].[dbo].[Regions]
		(
			RegionId,
			RegionName,
			RegionTypeId
		)
	SELECT
		R.ID_Region,
		R.Region,
		RT.RegionTypeId
	FROM
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - Region] R
	INNER JOIN
		[NDMC_TEST].[dbo].[RegionTypes] RT
		ON RT.RegionTypeName = R.RegionType

	SET IDENTITY_INSERT [NDMC_TEST].[dbo].[Regions] OFF

	UPDATE
		R
	SET
		R.ParentRegionId = R4.RegionId
	FROM
		[NDMC_TEST].[dbo].[Regions] R
	INNER JOIN
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - Region] R2
		ON R.RegionName = R2.Region
	LEFT OUTER JOIN
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - Region] R3
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
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - EventRegion] ER
	INNER JOIN
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - Region] R
		ON R.ID_Region = ER.RegionID
	INNER JOIN
		[NDMC_TEST].[dbo].[Regions] R2
		ON R2.RegionName = R.Region
END

--EventImpacts--
IF((SELECT COUNT(*) FROM [NDMC_TEST].[dbo].[EventImpacts]) = 0)
BEGIN
	INSERT INTO
		[NDMC_TEST].[dbo].[EventImpacts]
		(
			EventRegionId,
			TypeImpactId,
			Measure
		)
	SELECT
		EI.ID_EventRegion,
		EI.ID_TypeImpact,
		TRY_CONVERT (float, EI.Measure) AS [Measure]
	FROM
		[NDMC_ImportData].[dbo].[Updated Normalized Declared Disasters - EventImpact] EI
END