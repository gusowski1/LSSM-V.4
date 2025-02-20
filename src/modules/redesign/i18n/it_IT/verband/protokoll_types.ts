export default {
    mission: { regex: /Grande missione iniziata/ },
    event: { regex: /Evento alleanza avviato/ },
    appl_accepted: { regex: /Aggiunto all'alleanza/ },
    appl_declined: { regex: /Domanda negata/ },
    deny_appl: { regex: /Non può fare domanda per questa alleanza/ },
    allow_appl: { regex: /Può fare domanda per questa alleanza/ },
    left: { regex: /Ha lasciato l'alleanza/ },
    kicked: { regex: /Cacciato dall'alleanza/ },
    set_chatban: { regex: /Ban della chat impostato/ },
    remove_chatban: { regex: /Ban della chat rimosso/ },
    added_role: { regex: /Impostato come .*?/, title: 'Ruolo aggiunto' },
    removed_role: { regex: /Rimosso come .*?/, title: 'Ruolo rimosso' },
    start_schooling: { regex: /Corso creato/ },
    complete_schooling: { regex: /Corso completato/ },
    start_extension: { regex: /Espansione avviata/ },
    complete_extension: { regex: /Espansione finita/ },
    build: { regex: /Edificio costruito/ },
    demolish: { regex: /Edificio distrutto/ },
};
