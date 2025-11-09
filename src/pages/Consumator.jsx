import React from 'react';
import EtapaCard from '../components/EtapaCard';
import DetaliiEtapa from '../components/DetaliiEtapa';

const Consumator = () => {
    return (
        <div className="consumator">
            <img src="/lant_trasabilitate.png" alt="Lant Trasabilitate" className="lant-image" />
            <div className="etape">
                <EtapaCard etapa="Ferma" />
                <EtapaCard etapa="Transport & Logistică" />
                <EtapaCard etapa="Moară/Procesare" />
                <EtapaCard etapa="Senzorii IoT" />
                <EtapaCard etapa="Magazin" />
            </div>
            <DetaliiEtapa />
        </div>
    );
};

export default Consumator;