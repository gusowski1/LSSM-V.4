import Vue from 'vue';

import { ActionStoreParams } from 'typings/store/Actions';
import { APIActionStoreParams } from '../../typings/store/api/Actions';
import { Mission } from 'typings/Mission';
import { RootState } from '../../typings/store/RootState';
import { Vehicle } from '../../typings/Vehicle';
import { VehicleRadioMessage } from '../../typings/Ingame';
import { ActionTree, GetterTree, Module } from 'vuex';
import {
    APIState,
    StorageAPIKey,
    StorageGetterReturn,
} from '../../typings/store/api/State';
import { Building, BuildingCategory } from '../../typings/Building';

const STORAGE_KEYS = {
    buildings: 'aBuildings',
    vehicles: 'aVehicles',
    allianceinfo: 'aAlliance',
    settings: 'aSettings',
    credits: 'aCreditsInfo',
} as {
    [key in StorageAPIKey]: string;
};
const MUTATION_SETTERS = {
    buildings: 'setBuildings',
    vehicles: 'setVehicles',
    allianceinfo: 'setAllianceinfo',
    settings: 'setSettings',
    credits: 'setCreditsInfo',
} as {
    [key in StorageAPIKey]: string;
};

const API_MIN_UPDATE = 5 * 1000 * 60; // 5 Minutes
const STORAGE_DISABLED_KEY = 'lssmv4-storage-disabled';

const get_from_storage = <API extends StorageAPIKey>(
    key: API,
    storageBase = window
): StorageGetterReturn<API> => {
    try {
        return JSON.parse(
            storageBase[
                key === 'missions' ? 'localStorage' : 'sessionStorage'
            ].getItem(STORAGE_KEYS[key]) || ''
        ) as StorageGetterReturn<API>;
    } catch {
        return {
            lastUpdate: 0,
            value: null,
            user_id: window.user_id,
        };
    }
};
const get_from_parent = <API extends StorageAPIKey>(
    key: API
): StorageGetterReturn<API> => {
    const parent_api_state = (window.parent[PREFIX] as Vue).$store.state
        .api as APIState;
    const parent_state = parent_api_state[key];
    if (Object.values(parent_state).length) {
        return {
            value: parent_state,
            lastUpdate: parent_api_state.lastUpdates[key] ?? 0,
            user_id: window.user_id,
        };
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return get_from_storage(key, window.parent);
};
const get_from_broadcast = async <API extends StorageAPIKey>(
    key: API,
    dispatch: ActionStoreParams['dispatch']
): Promise<StorageGetterReturn<API>> => {
    return new Promise(resolve =>
        dispatch(
            'broadcast/request_state',
            {
                statePath: `api.${key}`,
            },
            { root: true }
        ).then((results: StorageGetterReturn<API>[]) => {
            results.sort((a, b) =>
                a.lastUpdate < b.lastUpdate
                    ? -1
                    : a.lastUpdate > b.lastUpdate
                    ? 1
                    : 0
            );
            resolve(results[0]);
        })
    );
};
const get_api_values = async <API extends StorageAPIKey>(
    key: API,
    { dispatch, state, commit }: APIActionStoreParams,
    feature: string,
    preventUpdateFetch = false
): Promise<StorageGetterReturn<API>> => {
    let stored = {
        lastUpdate: 0,
        value: state[key],
        user_id: window.user_id,
    } as StorageGetterReturn<API>;
    if (
        !stored.value ||
        !Object.values(stored.value).length ||
        stored.lastUpdate < new Date().getTime()
    )
        stored = get_from_storage<API>(key);
    if (
        !stored.value ||
        stored.lastUpdate < new Date().getTime() - API_MIN_UPDATE
    )
        stored = get_from_parent<API>(key);
    if (
        !stored.value ||
        stored.lastUpdate < new Date().getTime() - API_MIN_UPDATE
    )
        stored = (await get_from_broadcast<API>(key, dispatch)) ?? stored;
    if (
        !state.currentlyUpdating.includes(key) &&
        (!stored.value ||
            !Object.values(stored.value).length ||
            (stored.lastUpdate < new Date().getTime() - API_MIN_UPDATE &&
                !preventUpdateFetch))
    ) {
        commit('startedUpdating', key);
        stored = {
            lastUpdate: new Date().getTime(),
            value: await dispatch('request', {
                url: `/api/${key}`,
                feature,
            }).then(res => res.json()),
            user_id: window.user_id,
        };
        commit('finishedUpdating', key);
    }
    return stored;
};

const set_api_storage = <API extends StorageAPIKey>(
    key: API,
    { value, lastUpdate }: StorageGetterReturn<API>,
    { commit, dispatch }: APIActionStoreParams
) => {
    const disabled: string[] = JSON.parse(
        localStorage.getItem(STORAGE_DISABLED_KEY) || '[]'
    );
    try {
        commit(MUTATION_SETTERS[key], { value, lastUpdate });
        if (!disabled.includes(key)) {
            sessionStorage.setItem(
                STORAGE_KEYS[key],
                JSON.stringify({
                    lastUpdate,
                    value,
                })
            );
        }
        dispatch(
            'broadcast/broadcast',
            {
                mutationPath: `api/${MUTATION_SETTERS[key]}`,
                payload: { value, lastUpdate },
            },
            { root: true }
        ).then();
        if (key === 'vehicles') {
            updateVehicleStates(
                value as StorageGetterReturn<'vehicles'>['value'],
                commit
            );
        }
    } catch {
        localStorage.setItem(
            STORAGE_DISABLED_KEY,
            JSON.stringify([...disabled, key])
        );
    }
};

const updateVehicleStates = (
    vehicles: StorageGetterReturn<'vehicles'>['value'],
    commit: APIActionStoreParams['commit']
) => {
    const states: Record<number, number> = {};
    vehicles?.forEach(({ fms_real }) => {
        if (!states.hasOwnProperty(fms_real)) states[fms_real] = 0;
        states[fms_real]++;
    });
    commit('setVehicleStates', states);
};

export default {
    namespaced: true,
    state: {
        buildings: [],
        vehicles: [],
        allianceinfo: {},
        vehicleStates: {},
        autoUpdates: [],
        currentlyUpdating: [],
        missions: [],
        key: null,
        lastUpdates: {},
        settings: {},
        credits: {},
    },
    mutations: {
        setBuildings(
            state: APIState,
            { value: buildings, lastUpdate }: StorageGetterReturn<'buildings'>
        ) {
            if (!buildings) return;
            const smallBuildings = ((window[PREFIX] as Vue).$t(
                'small_buildings'
            ) as unknown) as {
                [type: number]: number;
            };
            buildings.forEach(
                building =>
                    building.small_building &&
                    smallBuildings.hasOwnProperty(building.building_type) &&
                    (building.building_type =
                        smallBuildings[building.building_type])
            );
            state.lastUpdates.buildings = lastUpdate;
            state.buildings = buildings;
        },
        setVehicles(
            state: APIState,
            { value: vehicles, lastUpdate }: StorageGetterReturn<'vehicles'>
        ) {
            if (!vehicles) return;
            state.lastUpdates.vehicles = lastUpdate;
            state.vehicles = vehicles;
        },
        setAllianceinfo(
            state: APIState,
            {
                value: allianceinfo,
                lastUpdate,
            }: StorageGetterReturn<'allianceinfo'>
        ) {
            if (!allianceinfo) return;
            state.lastUpdates.allianceinfo = lastUpdate;
            state.allianceinfo = allianceinfo;
        },
        setVehicleStates(state: APIState, states: { [state: number]: number }) {
            const LSSM = window[PREFIX] as Vue;
            const fmsReal2Show = (LSSM.$t('fmsReal2Show') as unknown) as {
                [status: number]: number;
            };
            const states_show = {} as { [state: number]: number };
            Object.entries(fmsReal2Show).forEach(
                ([real, show]) =>
                    (states_show[show] = states[parseInt(real)] ?? 0)
            );
            state.vehicleStates = states_show;
        },
        setVehicleState(
            state: APIState,
            {
                fms,
                fms_real,
                id,
                caption,
                target_building_id,
                mission_id,
            }: VehicleRadioMessage
        ) {
            const vehicle = state.vehicles.find(v => v.id === id);
            if (!vehicle) return;
            state.vehicleStates[vehicle.fms_show]--;
            if (!state.vehicleStates.hasOwnProperty(fms))
                state.vehicleStates[fms] = 0;
            state.vehicleStates[fms]++;
            vehicle.caption = caption;
            vehicle.fms_show = fms;
            vehicle.fms_real = fms_real;
            if (mission_id) {
                vehicle.target_type = 'mission';
                vehicle.target_id = mission_id;
            } else if (target_building_id) {
                vehicle.target_type = 'building';
                vehicle.target_id = target_building_id;
            } else {
                vehicle.target_type = null;
                vehicle.target_id = null;
            }
        },
        enableAutoUpdate(state: APIState, api: StorageAPIKey) {
            state.autoUpdates.push(api);
        },
        setMissions(state: APIState, missions: Mission[]) {
            state.missions = missions;
        },
        setKey(state: APIState, key: string) {
            state.key = key;
        },
        startedUpdating(state: APIState, key: StorageAPIKey) {
            state.currentlyUpdating = [
                ...new Set([...state.currentlyUpdating, key]),
            ];
        },
        finishedUpdating(state: APIState, key: StorageAPIKey) {
            state.currentlyUpdating.splice(
                state.currentlyUpdating.findIndex(k => k === key),
                1
            );
        },
        setSettings(
            state: APIState,
            { value: settings, lastUpdate }: StorageGetterReturn<'settings'>
        ) {
            if (!settings) return;
            state.lastUpdates.settings = lastUpdate;
            state.settings = settings;
        },
        setCreditsInfo(
            state: APIState,
            { value: credits, lastUpdate }: StorageGetterReturn<'credits'>
        ) {
            if (!credits) return;
            state.lastUpdates.credits = lastUpdate;
            state.credits = credits;
        },
    },
    getters: {
        vehicle: state => (id: number) => {
            return state.vehicles.find(v => v.id === id);
        },
        vehiclesByBuilding(state) {
            const buildings = {} as { [buildingId: number]: Vehicle[] };
            state.vehicles.forEach(vehicle => {
                if (!buildings.hasOwnProperty(vehicle.building_id))
                    buildings[vehicle.building_id] = [];
                buildings[vehicle.building_id].push(vehicle);
            });
            return buildings;
        },
        buildingsByType(state) {
            const types = {} as {
                [type: number]: Building[];
            };
            state.buildings.forEach(b => {
                if (!types.hasOwnProperty(b.building_type))
                    types[b.building_type] = [];
                types[b.building_type].push(b);
            });
            return types;
        },
        buildingsByCategory(state, getters) {
            const LSSM = window[PREFIX] as Vue;
            const categories = (LSSM.$t('buildingCategories') as unknown) as {
                [category: string]: BuildingCategory;
            };
            const buildingsByCategory = {} as {
                [category: string]: Building[];
            };
            const { buildingsByType } = getters;
            Object.entries(categories).forEach(
                ([category, { buildings }]) =>
                    (buildingsByCategory[category] = [
                        ...Object.values(buildings).flatMap(
                            type => buildingsByType[type]
                        ),
                    ].filter(v => !!v))
            );
            return buildingsByCategory;
        },
        vehiclesByType(state) {
            const types = {} as {
                [type: string]: Vehicle[];
            };
            state.vehicles.forEach(vehicle => {
                if (!types.hasOwnProperty(vehicle.vehicle_type))
                    types[vehicle.vehicle_type] = [];
                types[vehicle.vehicle_type].push(vehicle);
            });
            return types;
        },
        vehiclesByTarget(state) {
            const result = {} as {
                mission: { [id: number]: Vehicle[] };
                building: { [id: number]: Vehicle[] };
            };
            state.vehicles.forEach(vehicle => {
                if (!vehicle.target_type || !vehicle.target_id) return;
                if (!result.hasOwnProperty(vehicle.target_type))
                    result[vehicle.target_type] = {};
                if (
                    !result[vehicle.target_type].hasOwnProperty(
                        vehicle.target_id
                    )
                )
                    result[vehicle.target_type][vehicle.target_id] = [];
                result[vehicle.target_type][vehicle.target_id].push(vehicle);
            });
            return result;
        },
        missionsById(state) {
            return Object.fromEntries(state.missions.map(m => [m.id, m]));
        },
    } as GetterTree<APIState, RootState>,
    actions: {
        initialUpdate(
            store: APIActionStoreParams,
            { type, feature }: { type: StorageAPIKey; feature: string }
        ) {
            return new Promise<void>(resolve =>
                get_api_values(
                    type,
                    store,
                    `store/api/initialUpdate/${type}(${feature})`,
                    true
                ).then(result => {
                    store.commit(MUTATION_SETTERS[type], result);
                    resolve();
                })
            );
        },
        setVehicleStates(
            { dispatch, commit }: APIActionStoreParams,
            feature: string
        ) {
            return new Promise<void>(resolve => {
                dispatch('request', {
                    url: '/api/vehicle_states',
                    feature: `store/api/setVehicleStates(${feature})`,
                })
                    .then(res => res.json())
                    .then(states => {
                        commit('setVehicleStates', states);
                        resolve();
                    });
            });
        },
        async registerBuildingsUsage(
            store: APIActionStoreParams,
            {
                autoUpdate = false,
                feature,
            }: { autoUpdate: boolean; feature: string }
        ) {
            const { value: buildings, lastUpdate } = await get_api_values(
                'buildings',
                store,
                `store/api/registerBuildingsUsage(${feature})`
            );
            if (!buildings) return;
            set_api_storage(
                'buildings',
                { value: buildings, lastUpdate, user_id: window.user_id },
                store
            );
            if (autoUpdate && !store.state.autoUpdates.includes('buildings')) {
                store.commit('enableAutoUpdate', 'buildings');
                window.setInterval(
                    () => store.dispatch('registerBuildingsUsage', { feature }),
                    API_MIN_UPDATE
                );
            }
        },
        async fetchBuilding(
            store: APIActionStoreParams,
            { id, feature }: { id: number; feature: string }
        ) {
            return new Promise((resolve, reject) => {
                store
                    .dispatch('request', {
                        url: `/api/buildings/${id}`,
                        feature: `store/api/fetchBuilding(${feature})`,
                    })
                    .then(res => res.json())
                    .then(async (building: Building) => {
                        const {
                            value: buildings,
                            lastUpdate,
                        } = await get_api_values(
                            'buildings',
                            store,
                            `store/api/fetchBuilding(${feature})`
                        );
                        if (!buildings) return reject();
                        buildings[
                            buildings.findIndex(b => b.id === id)
                        ] = building;
                        set_api_storage(
                            'buildings',
                            {
                                value: buildings,
                                lastUpdate,
                                user_id: window.user_id,
                            },
                            store
                        );
                        return resolve(building);
                    });
            });
        },
        async registerVehiclesUsage(
            store: APIActionStoreParams,
            {
                autoUpdate = false,
                feature,
            }: { autoUpdate: boolean; feature: string }
        ) {
            const { value: vehicles, lastUpdate } = await get_api_values(
                'vehicles',
                store,
                `store/api/registerVehiclesUsage(${feature})`
            );
            if (!vehicles) return;
            set_api_storage(
                'vehicles',
                { value: vehicles, lastUpdate, user_id: window.user_id },
                store
            );
            if (autoUpdate && !store.state.autoUpdates.includes('vehicles')) {
                store.commit('enableAutoUpdate', 'vehicles');
                window.setInterval(
                    () => store.dispatch('registerVehiclesUsage', { feature }),
                    API_MIN_UPDATE
                );
            }
        },
        async fetchVehicle(
            store: APIActionStoreParams,
            { id, feature }: { id: number; feature: string }
        ) {
            return new Promise((resolve, reject) => {
                store
                    .dispatch('request', {
                        url: `/api/vehicles/${id}`,
                        feature: `store/api/fetchVehicle(${feature})`,
                    })
                    .then(res => res.json())
                    .then(async (vehicle: Vehicle) => {
                        const {
                            value: vehicles,
                            lastUpdate,
                        } = await get_api_values(
                            'vehicles',
                            store,
                            `store/api/fetchVehicle(${feature})`
                        );
                        if (!vehicles) return reject();
                        const index = vehicles.findIndex(v => v.id === id);
                        if (index < 0) vehicles.push(vehicle);
                        else vehicles[index] = vehicle;
                        set_api_storage(
                            'vehicles',
                            {
                                value: vehicles,
                                lastUpdate,
                                user_id: window.user_id,
                            },
                            store
                        );
                        return resolve(vehicle);
                    });
            });
        },
        async fetchVehiclesAtBuilding(
            store: APIActionStoreParams,
            { id, feature }: { id: number; feature: string }
        ) {
            return new Promise((resolve, reject) => {
                store
                    .dispatch('request', {
                        url: `/api/buildings/${id}/vehicles`,
                        feature: `store/api/fetchVehiclesAtBuilding(${feature})`,
                    })
                    .then(res => res.json())
                    .then(async (vehiclesAt: Vehicle[]) => {
                        const {
                            value: vehicles,
                            lastUpdate,
                        } = await get_api_values(
                            'vehicles',
                            store,
                            `store/api/fetchVehiclesAtBuilding(${feature})`
                        );
                        if (!vehicles) return reject();
                        vehiclesAt.forEach(vehicle => {
                            const index = vehicles.findIndex(
                                v => v.id === vehicle.id
                            );
                            if (index < 0) vehicles.push(vehicle);
                            else vehicles[index] = vehicle;
                        });
                        set_api_storage(
                            'vehicles',
                            {
                                value: vehicles,
                                lastUpdate,
                                user_id: window.user_id,
                            },
                            store
                        );
                        return resolve(vehiclesAt);
                    });
            });
        },
        async registerAllianceinfoUsage(
            store: APIActionStoreParams,
            {
                autoUpdate = false,
                feature,
            }: { autoUpdate: boolean; feature: string }
        ) {
            const { value: allianceinfo, lastUpdate } = await get_api_values(
                'allianceinfo',
                store,
                `store/api/registerAllianceinfoUsage(${feature})`
            );
            if (!allianceinfo) return;
            set_api_storage(
                'allianceinfo',
                { value: allianceinfo, lastUpdate, user_id: window.user_id },
                store
            );
            if (
                autoUpdate &&
                !store.state.autoUpdates.includes('allianceinfo')
            ) {
                store.commit('enableAutoUpdate', 'allianceinfo');
                window.setInterval(
                    () =>
                        store.dispatch('registerAllianceinfoUsage', {
                            feature,
                        }),
                    API_MIN_UPDATE
                );
            }
        },
        async registerSettings(
            store: APIActionStoreParams,
            {
                autoUpdate = false,
                feature,
            }: { autoUpdate: boolean; feature: string }
        ) {
            const { value: settings, lastUpdate } = await get_api_values(
                'settings',
                store,
                `store/api/registerSettings(${feature})`
            );
            if (!settings) return;
            set_api_storage(
                'settings',
                { value: settings, lastUpdate, user_id: window.user_id },
                store
            );
            if (autoUpdate && !store.state.autoUpdates.includes('settings')) {
                store.commit('enableAutoUpdate', 'settings');
                window.setInterval(
                    () => store.dispatch('registerSettings', { feature }),
                    API_MIN_UPDATE
                );
            }
        },
        async fetchCreditsInfo(store: APIActionStoreParams, feature: string) {
            return new Promise((resolve, reject) => {
                get_api_values(
                    'credits',
                    store,
                    `store/api/fetchCreditsInfo(${feature})`
                ).then(({ value: credits, lastUpdate }) => {
                    if (!credits) reject();
                    set_api_storage(
                        'credits',
                        {
                            value: credits,
                            lastUpdate,
                            user_id: window.user_id,
                        },
                        store
                    );
                    resolve(credits);
                });
            });
        },
        async getMissions(
            { rootState, state, dispatch, commit }: APIActionStoreParams,
            { force, feature }: { force: boolean; feature: string }
        ) {
            if (state.missions.length) return state.missions;
            if (
                force ||
                !sessionStorage.hasOwnProperty('mission_specs_cache')
            ) {
                const missions = Object.values(
                    await dispatch('request', {
                        // eslint-disable-next-line no-undef
                        url: `${rootState.server}missions/${rootState.lang}.json`,
                        init: {
                            method: 'GET',
                        },
                        feature: `store/api/getMissions(${feature})`,
                    }).then(res => res.json())
                );
                sessionStorage.setItem(
                    'mission_specs_cache',
                    JSON.stringify(missions)
                );
                commit('setMissions', missions);
                return missions;
            } else {
                const missions = JSON.parse(
                    sessionStorage.getItem('mission_specs_cache') || '{}'
                ) as Mission[];
                commit('setMissions', missions);
                return missions;
            }
        },
        async request(
            { rootState, dispatch, state, commit }: APIActionStoreParams,
            { input, url = '', init = {}, feature }
        ) {
            if (input && url) {
                await dispatch(
                    'console/warn',
                    [
                        `Request was initialized with both, input and URL, input object will be used!`,
                        'input:',
                        input,
                        'URL:',
                        url,
                    ],
                    {
                        root: true,
                    }
                );
            }
            init.headers = init.headers || {};
            if (init.headers.hasOwnProperty('X-LSS-Manager')) {
                await dispatch(
                    'console/warn',
                    [
                        `Request Header "X-LSS-Manager" with value ${JSON.stringify(
                            init.headers['X-LSS-Manager']
                        )} will be overwritten by ${JSON.stringify(
                            rootState.version
                        )}!`,
                    ],
                    {
                        root: true,
                    }
                );
            }
            init.headers['X-LSS-Manager'] = rootState.version;
            init.headers['X-LSS-Manager-Feature'] = feature;
            init.cache = init.cache || 'no-cache';
            const target = input || url;
            if (target.toString().startsWith(rootState.server)) {
                if (!state.key) {
                    commit(
                        'setKey',
                        await dispatch('request', {
                            url: `/profile/external_secret_key/${window.user_id}`,
                        })
                            .then(res => res.json())
                            .then(({ code }) => code)
                    );
                }
                init.headers['X-LSSM-User'] = btoa(
                    `${state.key}:${rootState.version}-${MODE}`
                );
            }
            return fetch(target, init).then(
                res =>
                    new Promise((resolve, reject) => {
                        if (!res.ok) {
                            return res.json().then(data => {
                                if (data.error === 'outdated version') {
                                    const LSSM = window[PREFIX] as Vue;
                                    LSSM.$modal.show('dialog', {
                                        title: LSSM.$t(
                                            'warnings.version.title'
                                        ),
                                        text: LSSM.$t('warnings.version.text', {
                                            version: data.version,
                                            curver: rootState.version,
                                        }),
                                        buttons: [
                                            {
                                                title: LSSM.$t(
                                                    'warnings.version.close'
                                                ),
                                                default: true,
                                                handler() {
                                                    window.location.reload(
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-ignore
                                                        true
                                                    );
                                                },
                                            },
                                            {
                                                title: LSSM.$t(
                                                    'warnings.version.abort'
                                                ),
                                            },
                                        ],
                                    });
                                    window.focus();
                                }
                                return reject(res);
                            });
                        }
                        return resolve(res);
                    })
            );
        },
    } as ActionTree<APIState, RootState>,
} as Module<APIState, RootState>;
