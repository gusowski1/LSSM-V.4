module.exports = {
    arrCounter: {
        resetTexts: {
            counter: 'Contador ARR',
            highlight: 'Borde ARR',
            selection: 'Selección de vehículos',
            counter_highlight: 'Contador / borde ARR',
            counter_selection: 'Contador ARR y selección de vehículos',
            highlight_selection: 'Contador ARR y selección de vehículos',
            counter_highlight_selection:
                'Contador / borde ARR y selección de vehículos',
        },
        reset: '{text} restablecer',
    },
    arrHover: {
        reset: '¡La selección de vehículos se restablecerá antes!',
        headers: {
            set: 'Set',
            attribute: 'Nombre',
            free: 'Gratis',
            max: 'Máximo',
        },
        titles: {
            set:
                'Muy a menudo, esta combinación se selecciona cuando presiona al ARR',
            attribute: 'La combinación se describe en esta línea',
            free: 'Muy a menudo esta combinación está disponible',
            max:
                'Puede seleccionar este ARR hasta que esta combinación ya no esté disponible',
        },
        arrSpecs: {
            fire: 'Camiones de bomberos',
            hlf_only: 'Vehículo de rescate',
            elw: 'Unidad de Mando y Comunicaciones (UMC)',
            elw2: 'Unidad de mando móvil',
            fly_car: 'VIR',
            fly_car_any: 'VIR / Médico de cabecera',
            dlk: 'Camión AE',
            kdow_orgl: 'Unidad logística de AMV',
            ktw: 'Ambulancia SVB',
            rtw: 'UVI móvil',
            rw: 'Furgones de Útiles Varios (FUV)',
            gwl2wasser: 'Camión cisterna (BNP)',
            gwgefahrgut: 'Hazmat (TPP)',
            gwa: 'Unidad aérea',
            fustw: 'Coche patrulla',
            polizeihubschrauber: 'Helicóptero de Policía',
            swat_suv: 'Unidad GEO',
            swat_armored_vehicle: 'Unidad Antidisturbios',
            k9: 'Unidad Canina',
            rth_only: 'HEMS',
        },
    },
    enhancedMissingVehicles: {
        vehicle: 'Tipo de vehículo',
        missing: 'En la misión falta',
        driving: 'En camino',
        total: 'Necesitas',
        tip: {
            dragging: 'arrastrar ventana',
            textMode: 'modo de texto on/off',
            minified: 'minimizar',
            overlay: 'cubrir',
            reload: 'recargar',
            pushRight: 'muestra este cuadro encima de la lista de vehículos',
            pushLeft: 'muestra este cuadro en la posición original',
        },
        selected: 'Seleccionado',
        water: 'l de agua',
        foam: 'l de espuma',
        vehiclesByRequirement: {
            [/^camion(es)? de bomberos$/]: [0, 1, 12],
            [/^camion(es)? con plataforma$/]: [2],
            [/^unidad(es)? de Mando y Comunicaciones$/]: [3, 11],
            [/^Furgones de Útiles Varios?$/]: [4, 12],
            [/^Unidad aérea?$/]: [10],
            [/^camion(es)? cisterna(s)?$/]: [6],
            [/^unidad(es)? de Mando$/]: [11],
            [/^Vehículo(s)? TPP$/]: [7],
            [/^Ambulancia(s)?$/]: [5],
            [/^Coche(s)? patrulla(s)?$/]: [9, 17],
            [/^HEMS$/]: [9],
            [/^Helicóptero(s)? de policía$/]: [13],
            [/^SWAT$/]: [14, 15],
            [/^Unidad(es)? canina(s)?$/]: [16],
            [/^vehículo(s)? de extinción por espuma(s)?$/]: [23],
            [/^bomba(s)? accionada por motor(s)?$/]: [24],
        },
    },
    tailoredTabs: {
        allTab: 'Todo',
        occupiedTab: 'Siguiente',
        vehicleMissing: {
            title:
                'Un vehículo no está presente en ninguna pestaña | Varios vehículos no están presentes en ninguna pestaña',
            text:
                'Los siguientes tipos de vehículos solo están presentes en la pestaña "Todo":',
            hide: 'Ocultar nota',
            close: 'Cerrar la nota hasta el cambio',
        },
    },
    hideVehicleList: {
        show: 'Mostrar lista de vehículos',
        hide: 'Ocultar lista de vehículos',
    },
};
