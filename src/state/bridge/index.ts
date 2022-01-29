/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'config/constants/farms'
import bridgesConfig from 'config/constants/bridge'
import isArchivedPid from 'utils/farmHelpers'
import { Bridge, BridgeState, Farm } from '../types'
import fetchBridges from './fetchBridges'
import {
  fetchFarmUserAllowances, fetchFarmUserEarnings,
  fetchFarmUserStakedBalances,
  fetchFarmUserTokenBalances,
} from '../farms/fetchFarmUser'

const noAccountBridgeConfig = bridgesConfig.map((bridge) => ({
  ...bridge,
}))

const initialState: BridgeState = { data: noAccountBridgeConfig }

// Async thunks
export const fetchPublicBridgeDataAsync = createAsyncThunk<Bridge[], number[]>(
  'bridge/fetchPublicBridgeDataAsync',
  async () => {
    const bridgeToFetch = bridgesConfig.filter((bridgeConfig) => bridgeConfig.address)

    const bridges = await fetchBridges(bridgeToFetch)

    return bridges.filter((bridge) => {
      return bridge.address
    })
  },
)

export const bridgeSlice = createSlice({
  name: 'Bridges',
  initialState,
  reducers: {
    setLoadArchivedFarmsData: (state, action) => {
      // const loadArchivedFarmsData = action.payload
      // state.loadArchivedFarmsData = loadArchivedFarmsData
    },
  },
  extraReducers: (builder) => {
    // Update farms with live data
    builder.addCase(fetchPublicBridgeDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((bridge) => {
        return { ...bridge }
      })
    })

    // Update farms with user data
    // builder.addCase(fetchFarmUserDataAsync.fulfilled, (state, action) => {
    //   action.payload.forEach((userDataEl) => {
    //     const { pid } = userDataEl
    //     const index = state.data.findIndex((farm) => farm.pid === pid)
    //     state.data[index] = { ...state.data[index], userData: userDataEl }
    //   })
    //   state.userDataLoaded = true
    // })
  },
})

// Actions
export const { setLoadArchivedFarmsData } = bridgeSlice.actions

export default bridgeSlice.reducer
