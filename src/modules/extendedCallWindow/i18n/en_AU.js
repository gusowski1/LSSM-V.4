module.exports = {
    arrCounter: {
        resetTexts: {
            counter: 'ARR-Counter',
            highlight: 'ARR border',
            selection: 'Vehicle selection',
            counter_highlight: 'ARR counter / border',
            counter_selection: 'ARR counter and vehicle selection',
            highlight_selection: 'ARR border and vehicle selection',
            counter_highlight_selection:
                'ARR counter / border and vehicle selection',
        },
        reset: '{text} reset',
    },
    arrHover: {
        reset: 'The vehicle selection is reset before!',
        headers: {
            set: 'Set',
            attribute: 'Name',
            free: 'Free',
            max: 'Max',
        },
        titles: {
            set: 'So often this combination is selected when you press the ARR',
            attribute: 'The combination described in this line',
            free: 'So often this combination is available',
            max:
                'You can select this ARR until this combination is no longer available',
        },
        arrSpecs: {
            fire: 'Pumper or Light Tanker or Tanker',
            hlf_only: 'Rescue Pumper',
            elw: 'Support Vehicle',
            elw2: 'Mobile Command Vehicle',
            dlk: 'Turntable Ladders',
            rtw: 'Ambulance',
            rw: 'Rescue',
            gwa: 'BASU',
            gwl2wasser: 'Bulk Water Tanker',
            gwgefahrgut: 'HAZMAT Unit',
            rth_only: 'Air Ambulance',
            fustw: 'Patrol Car',
            police_motorcycle: 'Police Motorcycle',
            fustw_or_police_motorcycle: 'Police car or Police Motorcycle',
            polizeihubschrauber: 'Police helicopter',
            swat: 'TOG',
            swat_armored: 'TOG Armoured Vehicle',
            swat_suv: 'TOG SUV',
            k9: 'K-9 Unit',
            police_horse: 'Mounted Police',
            gw_wasserrettung: 'SES Vehicle',
            mzb: 'Rescue Boat',
            wasser_amount: 'Litres of water',
            brush_vehicle: 'Brush Truck',
            brush_truck: 'Brush Truck',
            fire_aviation: 'Fire Aviation',
            water_drop_helicopter: 'Fire Helicopter',
            air_tanker: 'Bomber',
            heavy_air_tanker: 'Large Air tanker',
        },
    },
    enhancedMissingVehicles: {
        vehicle: 'Vehicle type',
        missing: 'Missing on mission',
        driving: 'En-route',
        total: 'Still needed',
        tip: {
            dragging: 'drag window',
            textMode: 'textmode on/off',
            minified: 'collapse',
            overlay: 'overlay',
            reload: 'reload',
            pushRight: 'show this box above vehicle list',
            pushLeft: 'show this box at original position',
        },
        selected: 'Selected',
        water: 'l. water',
        staff: {
            [/^TOG Personnel$/]: [15, 18],
        },
        towingVehicles: {
            // Note: Only the ones that are towed by vehicles of the same group! If e.g. a MzB can be towed by vehicles of several groups, it MUST NOT be listed here.
            21: [20],
            22: [8],
        },
        vehiclesByRequirement: {
            [/^Fire engine(s)?$/]: [0, 1, 12, 13, 19],
            [/^Turntable Ladder trucks?$/]: [2, 13],
            [/^Support Vehicle(s)?$/]: [3, 11],
            [/^Major Rescue Vehicle(s)?$/]: [4, 12, 26],
            [/^BASU$/]: [10],
            [/^Water Carrier(s)?$/]: [6, 19],
            [/^Mobile Command Vehicle(s)?$/]: [11],
            [/^HAZMAT Truck(s)$/]: [7],
            [/^Ambulance(s)?$/]: [5],
            [/^Police car(s)?$/]: [8, 16, 17],
            [/^HEMS$/]: [9],
            [/^Police Helicopter(s)?$/]: [14],
            [/^TOG Vehicles$/]: [15, 18],
            [/^K-9 Unit(s)?$/]: [16],
            [/^Mounted Police?$/]: [22],
            [/^SES?$/]: [20],
            [/^Brush Truck(s)?$/]: [19, 28, 29, 30],
            [/^Airborne firefighting vehicle(s)?$/]: [31, 32, 33],
        },
    },
    tailoredTabs: {
        allTab: 'All',
        occupiedTab: 'Follow-up',
        vehicleMissing: {
            title:
                'One vehicle is not present in any tab | Several vehicles are not present in any tab',
            text:
                'The following vehicle types are only present in the "All" tab:',
            hide: 'Hide Note',
            close: 'Close Note till change',
        },
    },
    hideVehicleList: {
        show: 'Show vehicle list',
        hide: 'Hide vehicle list',
    },
};
