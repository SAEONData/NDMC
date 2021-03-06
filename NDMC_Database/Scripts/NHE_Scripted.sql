USE [master]
GO
/****** Object:  Database [NDMC_TEST]    Script Date: 2019/01/09 18:58:14 ******/
CREATE DATABASE [NDMC_TEST] ON  PRIMARY 
( NAME = N'NDMC_TEST', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.MSSQLSERVER\MSSQL\DATA\NDMC_TEST.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'NDMC_TEST_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.MSSQLSERVER\MSSQL\DATA\NDMC_TEST_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [NDMC_TEST].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [NDMC_TEST] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [NDMC_TEST] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [NDMC_TEST] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [NDMC_TEST] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [NDMC_TEST] SET ARITHABORT OFF 
GO
ALTER DATABASE [NDMC_TEST] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [NDMC_TEST] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [NDMC_TEST] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [NDMC_TEST] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [NDMC_TEST] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [NDMC_TEST] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [NDMC_TEST] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [NDMC_TEST] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [NDMC_TEST] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [NDMC_TEST] SET  DISABLE_BROKER 
GO
ALTER DATABASE [NDMC_TEST] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [NDMC_TEST] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [NDMC_TEST] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [NDMC_TEST] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [NDMC_TEST] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [NDMC_TEST] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [NDMC_TEST] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [NDMC_TEST] SET RECOVERY FULL 
GO
ALTER DATABASE [NDMC_TEST] SET  MULTI_USER 
GO
ALTER DATABASE [NDMC_TEST] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [NDMC_TEST] SET DB_CHAINING OFF 
GO
EXEC sys.sp_db_vardecimal_storage_format N'NDMC_TEST', N'ON'
GO
USE [NDMC_TEST]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 2019/01/09 18:58:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DeclaredEvents]    Script Date: 2019/01/09 18:58:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DeclaredEvents](
	[DeclaredEventId] [int] IDENTITY(1,1) NOT NULL,
	[DeclaredDate] [bigint] NULL,
	[EventId] [int] NOT NULL,
 CONSTRAINT [PK_DeclaredEvents] PRIMARY KEY CLUSTERED 
(
	[DeclaredEventId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EventImpacts]    Script Date: 2019/01/09 18:58:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EventImpacts](
	[EventImpactId] [int] IDENTITY(1,1) NOT NULL,
	[Measure] [float] NULL,
	[EventRegionId] [int] NOT NULL,
	[TypeImpactId] [int] NOT NULL,
	[UnitOfMeasure] [nvarchar](max) NULL,
 CONSTRAINT [PK_EventImpacts] PRIMARY KEY CLUSTERED 
(
	[EventImpactId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EventRegions]    Script Date: 2019/01/09 18:58:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EventRegions](
	[EventRegionId] [int] IDENTITY(1,1) NOT NULL,
	[EventId] [int] NOT NULL,
	[RegionId] [int] NOT NULL,
 CONSTRAINT [PK_EventRegions] PRIMARY KEY CLUSTERED 
(
	[EventRegionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Events]    Script Date: 2019/01/09 18:58:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Events](
	[EventId] [int] IDENTITY(1,1) NOT NULL,
	[StartDate] [bigint] NULL,
	[EndDate] [bigint] NULL,
	[Location_WKT] [nvarchar](max) NULL,
	[TypeEventId] [int] NULL,
	[TypeSourceId] [int] NULL,
 CONSTRAINT [PK_Events] PRIMARY KEY CLUSTERED 
(
	[EventId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Mitigations]    Script Date: 2019/01/09 18:58:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Mitigations](
	[MitigationId] [int] IDENTITY(1,1) NOT NULL,
	[Date] [bigint] NULL,
	[Value] [float] NULL,
	[EventId] [int] NOT NULL,
	[TypeMitigationId] [int] NOT NULL,
 CONSTRAINT [PK_Mitigations] PRIMARY KEY CLUSTERED 
(
	[MitigationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Regions]    Script Date: 2019/01/09 18:58:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Regions](
	[RegionId] [int] IDENTITY(1,1) NOT NULL,
	[RegionName] [nvarchar](max) NOT NULL,
	[ParentRegionId] [int] NULL,
	[RegionTypeId] [int] NULL,
 CONSTRAINT [PK_Regions] PRIMARY KEY CLUSTERED 
(
	[RegionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RegionTypes]    Script Date: 2019/01/09 18:58:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RegionTypes](
	[RegionTypeId] [int] IDENTITY(1,1) NOT NULL,
	[RegionTypeName] [nvarchar](max) NULL,
 CONSTRAINT [PK_RegionTypes] PRIMARY KEY CLUSTERED 
(
	[RegionTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TypeEvents]    Script Date: 2019/01/09 18:58:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TypeEvents](
	[TypeEventId] [int] IDENTITY(1,1) NOT NULL,
	[TypeEventName] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_TypeEvents] PRIMARY KEY CLUSTERED 
(
	[TypeEventId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TypeImpacts]    Script Date: 2019/01/09 18:58:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TypeImpacts](
	[TypeImpactId] [int] IDENTITY(1,1) NOT NULL,
	[TypeImpactName] [nvarchar](max) NOT NULL,
	[UnitOfMeasure] [nvarchar](max) NULL,
	[ParentTypeImpactId] [int] NULL,
 CONSTRAINT [PK_TypeImpacts] PRIMARY KEY CLUSTERED 
(
	[TypeImpactId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TypeMitigations]    Script Date: 2019/01/09 18:58:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TypeMitigations](
	[TypeMitigationId] [int] IDENTITY(1,1) NOT NULL,
	[TypeMitigationName] [nvarchar](max) NOT NULL,
	[UnitOfMeasure] [nvarchar](max) NULL,
	[ParentTypeMitigationId] [int] NULL,
 CONSTRAINT [PK_TypeMitigations] PRIMARY KEY CLUSTERED 
(
	[TypeMitigationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TypeSources]    Script Date: 2019/01/09 18:58:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TypeSources](
	[TypeSourceId] [int] IDENTITY(1,1) NOT NULL,
	[TypeSourceName] [nvarchar](max) NOT NULL,
	[TypeSourceSource] [nvarchar](max) NULL,
 CONSTRAINT [PK_TypeSources] PRIMARY KEY CLUSTERED 
(
	[TypeSourceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Index [IX_DeclaredEvents_EventId]    Script Date: 2019/01/09 18:58:14 ******/
CREATE NONCLUSTERED INDEX [IX_DeclaredEvents_EventId] ON [dbo].[DeclaredEvents]
(
	[EventId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_EventImpacts_EventRegionId]    Script Date: 2019/01/09 18:58:14 ******/
CREATE NONCLUSTERED INDEX [IX_EventImpacts_EventRegionId] ON [dbo].[EventImpacts]
(
	[EventRegionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_EventImpacts_TypeImpactId]    Script Date: 2019/01/09 18:58:14 ******/
CREATE NONCLUSTERED INDEX [IX_EventImpacts_TypeImpactId] ON [dbo].[EventImpacts]
(
	[TypeImpactId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_EventRegions_EventId]    Script Date: 2019/01/09 18:58:14 ******/
CREATE NONCLUSTERED INDEX [IX_EventRegions_EventId] ON [dbo].[EventRegions]
(
	[EventId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_EventRegions_RegionId]    Script Date: 2019/01/09 18:58:14 ******/
CREATE NONCLUSTERED INDEX [IX_EventRegions_RegionId] ON [dbo].[EventRegions]
(
	[RegionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Events_TypeEventId]    Script Date: 2019/01/09 18:58:14 ******/
CREATE NONCLUSTERED INDEX [IX_Events_TypeEventId] ON [dbo].[Events]
(
	[TypeEventId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Events_TypeSourceId]    Script Date: 2019/01/09 18:58:14 ******/
CREATE NONCLUSTERED INDEX [IX_Events_TypeSourceId] ON [dbo].[Events]
(
	[TypeSourceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Mitigations_EventId]    Script Date: 2019/01/09 18:58:14 ******/
CREATE NONCLUSTERED INDEX [IX_Mitigations_EventId] ON [dbo].[Mitigations]
(
	[EventId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Mitigations_TypeMitigationId]    Script Date: 2019/01/09 18:58:14 ******/
CREATE NONCLUSTERED INDEX [IX_Mitigations_TypeMitigationId] ON [dbo].[Mitigations]
(
	[TypeMitigationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Regions_ParentRegionId]    Script Date: 2019/01/09 18:58:14 ******/
CREATE NONCLUSTERED INDEX [IX_Regions_ParentRegionId] ON [dbo].[Regions]
(
	[ParentRegionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Regions_RegionTypeId]    Script Date: 2019/01/09 18:58:14 ******/
CREATE NONCLUSTERED INDEX [IX_Regions_RegionTypeId] ON [dbo].[Regions]
(
	[RegionTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_TypeImpacts_ParentTypeImpactId]    Script Date: 2019/01/09 18:58:14 ******/
CREATE NONCLUSTERED INDEX [IX_TypeImpacts_ParentTypeImpactId] ON [dbo].[TypeImpacts]
(
	[ParentTypeImpactId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[DeclaredEvents]  WITH CHECK ADD  CONSTRAINT [FK_DeclaredEvents_Events_EventId] FOREIGN KEY([EventId])
REFERENCES [dbo].[Events] ([EventId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[DeclaredEvents] CHECK CONSTRAINT [FK_DeclaredEvents_Events_EventId]
GO
ALTER TABLE [dbo].[EventImpacts]  WITH CHECK ADD  CONSTRAINT [FK_EventImpacts_EventRegions_EventRegionId] FOREIGN KEY([EventRegionId])
REFERENCES [dbo].[EventRegions] ([EventRegionId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[EventImpacts] CHECK CONSTRAINT [FK_EventImpacts_EventRegions_EventRegionId]
GO
ALTER TABLE [dbo].[EventImpacts]  WITH CHECK ADD  CONSTRAINT [FK_EventImpacts_TypeImpacts_TypeImpactId] FOREIGN KEY([TypeImpactId])
REFERENCES [dbo].[TypeImpacts] ([TypeImpactId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[EventImpacts] CHECK CONSTRAINT [FK_EventImpacts_TypeImpacts_TypeImpactId]
GO
ALTER TABLE [dbo].[EventRegions]  WITH CHECK ADD  CONSTRAINT [FK_EventRegions_Events_EventId] FOREIGN KEY([EventId])
REFERENCES [dbo].[Events] ([EventId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[EventRegions] CHECK CONSTRAINT [FK_EventRegions_Events_EventId]
GO
ALTER TABLE [dbo].[EventRegions]  WITH CHECK ADD  CONSTRAINT [FK_EventRegions_Regions_RegionId] FOREIGN KEY([RegionId])
REFERENCES [dbo].[Regions] ([RegionId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[EventRegions] CHECK CONSTRAINT [FK_EventRegions_Regions_RegionId]
GO
ALTER TABLE [dbo].[Events]  WITH CHECK ADD  CONSTRAINT [FK_Events_TypeEvents_TypeEventId] FOREIGN KEY([TypeEventId])
REFERENCES [dbo].[TypeEvents] ([TypeEventId])
GO
ALTER TABLE [dbo].[Events] CHECK CONSTRAINT [FK_Events_TypeEvents_TypeEventId]
GO
ALTER TABLE [dbo].[Events]  WITH CHECK ADD  CONSTRAINT [FK_Events_TypeSources_TypeSourceId] FOREIGN KEY([TypeSourceId])
REFERENCES [dbo].[TypeSources] ([TypeSourceId])
GO
ALTER TABLE [dbo].[Events] CHECK CONSTRAINT [FK_Events_TypeSources_TypeSourceId]
GO
ALTER TABLE [dbo].[Mitigations]  WITH CHECK ADD  CONSTRAINT [FK_Mitigations_Events_EventId] FOREIGN KEY([EventId])
REFERENCES [dbo].[Events] ([EventId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Mitigations] CHECK CONSTRAINT [FK_Mitigations_Events_EventId]
GO
ALTER TABLE [dbo].[Mitigations]  WITH CHECK ADD  CONSTRAINT [FK_Mitigations_TypeMitigations_TypeMitigationId] FOREIGN KEY([TypeMitigationId])
REFERENCES [dbo].[TypeMitigations] ([TypeMitigationId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Mitigations] CHECK CONSTRAINT [FK_Mitigations_TypeMitigations_TypeMitigationId]
GO
ALTER TABLE [dbo].[Regions]  WITH CHECK ADD  CONSTRAINT [FK_Regions_Regions_ParentRegionId] FOREIGN KEY([ParentRegionId])
REFERENCES [dbo].[Regions] ([RegionId])
GO
ALTER TABLE [dbo].[Regions] CHECK CONSTRAINT [FK_Regions_Regions_ParentRegionId]
GO
ALTER TABLE [dbo].[Regions]  WITH CHECK ADD  CONSTRAINT [FK_Regions_RegionTypes_RegionTypeId] FOREIGN KEY([RegionTypeId])
REFERENCES [dbo].[RegionTypes] ([RegionTypeId])
GO
ALTER TABLE [dbo].[Regions] CHECK CONSTRAINT [FK_Regions_RegionTypes_RegionTypeId]
GO
ALTER TABLE [dbo].[TypeImpacts]  WITH CHECK ADD  CONSTRAINT [FK_TypeImpacts_TypeImpacts_ParentTypeImpactId] FOREIGN KEY([ParentTypeImpactId])
REFERENCES [dbo].[TypeImpacts] ([TypeImpactId])
GO
ALTER TABLE [dbo].[TypeImpacts] CHECK CONSTRAINT [FK_TypeImpacts_TypeImpacts_ParentTypeImpactId]
GO
USE [master]
GO
ALTER DATABASE [NDMC_TEST] SET  READ_WRITE 
GO
