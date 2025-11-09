import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { pause } from '../utils/pause';
const API = import.meta.env.VITE_API_URL;


const clientApi = createApi({
    reducerPath: 'album',
    tagTypes: ['Album'],
    baseQuery: fetchBaseQuery({
        baseUrl: API,
        fetchFn: async (...args) => {
            await pause(1000)
            return fetch(...args)
        }
    }),
    endpoints: (builder) => ({
        getAlbum: builder.query({
            query: () => ({
                url: `/album`,
            }),
            providesTags: ['Album'],
        })
    })
})


export const { useGetAlbumQuery } = clientApi
export default clientApi