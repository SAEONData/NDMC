--select
--	*

update
	ER
set
	ER.RegionId = RM.NewRegionId
from
	[NDMC_TEST].[dbo].[EventRegions] ER
inner join
	[NDMC_ImportData].[dbo].[RegionMappings] RM
	on ER.RegionId = RM.OldRegionId