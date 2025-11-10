import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { pause } from '../utils/pause';
const API = import.meta.env.VITE_API_URL;


const clientApi = createApi({
    reducerPath: 'client',
    tagTypes: ['Client'],
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
            providesTags: ['Client'],
        }),
        getLocationShip: builder.query({
            query: ({ lat, lng }) => ({
                url: `/store/distance?lat=${lat}&lng=${lng}`,
            }),
            providesTags: ['Client'],
        }),
        getAllFoods: builder.query({
            query: () => ({
                url: `foods`,
            }),
            providesTags: ['Client'],
        }),
        getFoodById: builder.query({
            query: ({ id }) => ({
                url: `foods/${id}`,
            }),
            providesTags: ['Client'],
        }),
        // create a new order
        createOrder: builder.mutation({
            query: (body) => ({
                url: `orders`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Client']
        }),
        // bulk create order items
        createOrderItemsBulk: builder.mutation({
            query: (body) => ({
                url: `order-items/bulk`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Client']
        }),
    })
})


export const { useGetAlbumQuery, useGetLocationShipQuery, useGetAllFoodsQuery, useGetFoodByIdQuery, useCreateOrderMutation, useCreateOrderItemsBulkMutation } = clientApi
export default clientApi