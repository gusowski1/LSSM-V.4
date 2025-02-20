export default {
    amount: 'Quantità',
    categories: {
        allianceMission: {
            regex: /^\[Alleanza]/,
            title: "Missioni dell'alleanza",
            backgroundColor: '#ff2800',
            textColor: 'white',
        },
        mission: {
            regex: '^%missions%( \\(Fire Alarm System\\))?( - False Alarm)?$',
            title: 'Missioni Proprie',
            backgroundColor: '#ff2400',
            textColor: 'white',
        },
        cancelledMissions: {
            regex: '^%missions%( \\(Fire Alarm System\\))? - [cC]anceled$',
            title: 'Missioni Cancellate',
            backgroundColor: '#7C7978',
            textColor: 'white',
        },
        buyVehicle: {
            regex: /Veicolo acquistato/,
            backgroundColor: '#007fff',
            textColor: 'white',
        },
        dailyLogin: {
            regex: /Ricompensa per accesso giornaliero/,
            backgroundColor: '#8db600',
            textColor: 'black',
        },
        buildings: {
            regex: /(Building constructed|Refund Building$|Building demolished without refund)/,
            title: 'Building constructed/demolished',
            backgroundColor: '#ed872d',
            textColor: 'black',
        },
        upgradeBuilding: {
            regex: /(Station (upgraded( \(from small .*? station\))??|constructed)|Cancel:|Refund Building upgrade)/,
            title: 'Stazione costruita',
            backgroundColor: '#000080',
            textColor: 'white',
        },
        task: {
            regex: /Completed task ".*?"/,
            title: 'Completed Task',
            backgroundColor: '#bb3385',
            textColor: 'white',
        },
        patients: {
            regex: /Trattamento Paziente/,
            title: 'Pazienti',
            backgroundColor: '#fff600',
            textColor: 'black',
        },
        alliancePatients: {
            regex: /Ospedale - Alleanza/,
            backgroundColor: '#ffff99',
            textColor: 'black',
        },
        alliancePrisoners: {
            regex: /Polizia - Alleanza/,
            backgroundColor: '#ffff99',
            textColor: 'black',
        },
        prisoners: {
            regex: /Prigioniero? Trasportato/,
            title: 'Prigioniero',
            backgroundColor: '#0bda51',
            textColor: 'black',
        },
        schoolings: {
            regex: /(education|Alliance Training Applicant)/,
            title: 'Educazione',
            backgroundColor: '#ff00ff',
            textColor: 'white',
        },
        shitComplexes: {
            regex: /(Attached building to Building Complex Base|Upgraded to Building Complex Base|Upgraded to Building Complex|Building Complex Base upgrade finished)/,
            title: 'Building Complex',
            backgroundColor: '#b5651d',
            textColor: 'white',
        },
        fireAlarmSystemCancel: {
            regex: /Falso Allarme/,
            titel: 'Falso Allarme',
            backgroundColor: '#c80815',
            textColor: 'white',
        },
    },
    category: 'Categoria',
    title: 'Riepilogo',
    total: 'Totale',
    others: 'Altro',
};
