export interface StructureItem {
  parent: string
  folders: FolderItem[]
}

export interface FolderItem {
  title: string;
  folder_uid: string;
  dashboards: DashboardItem[];
}

export interface DashboardItem {
  title: string;
  dashboard_uid: string;
  datasources: DataSourceItem[];
}

export type Datasource = InfluxDatasource | PythonApiDatasource | CustomDatasource

export interface InfluxDatasource {
  title: string
  type: 'InfluxDB_v1'
  config: InfluxDBConfig
}

export interface PythonApiDatasource {
  title: string
  type: 'Python_API'
  config: PythonApiConfig
}

export interface CustomDatasource {
  title: string
  type: string
  config: Record<string, any>
}

export interface InfluxDBConfig {
  url: string
  username: string
  password: string
}

export interface PythonApiConfig {
  url: string
}