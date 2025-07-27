// api/structureApi.ts
import axios from 'axios'
import type { StructureItem } from '../types/structure'

const structureApi = axios.create({
  baseURL: '/structure',
  withCredentials: true
})

export const getStructureTree = () => {
  return structureApi.get('/tree')
}

export const postBatchStatus = (structure: StructureItem[]) => {
  console.log(structure)
  const payload = structure.flatMap(parent => 
    parent.folders.map(folder => {
      const InfluxConfig = folder.dashboards[0]?.datasources.find(ds => ds.type === 'InfluxDB_v1').config
      console.log(InfluxConfig)
      if (!InfluxConfig) return null
      return {
        measurement: folder.title,
        dbname: InfluxConfig.dbname,
        url: InfluxConfig.url,
        username: InfluxConfig.username,
        password: InfluxConfig.password
      }
  }).filter(Boolean)
)
  return structureApi.post('/batch', payload)
}

export default structureApi

