'use client';

import React, { use, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import api from '@/services/common/api';
import { saveAs } from 'file-saver';

const PdfForm = () => {

    const [formData, setFormData] = useState({ nome: '', tipo_documento: '', descrizione: '' });
    const [loading, setLoading] = useState(false);
    const toast = React.useRef(null);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/backoffice/generate-pdf', formData, {responseType: 'blob'});
            saveAs(new Blob([response.data]), `documento_${formData.nome}.pdf`);
            toast.current.show({ severity: 'success', summary: 'Successo', detail: 'PDF Generato' });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Errore', detail: 'Generazione fallita' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <h5>Generatore PDF Documenti</h5>
            <div className="field">
                <label htmlFor="nome">Nome Soggetto</label>
                <InputText id="nome" className="w-full" value={formData.nome} 
                    onChange={(e) => setFormData({...formData, nome: e.target.value})} />
            </div>
            <div className="field">
                <label htmlFor="tipo">Tipo Documento</label>
                <InputText id="tipo" className="w-full" value={formData.tipo_documento} 
                    onChange={(e) => setFormData({...formData, tipo_documento: e.target.value})} />
            </div>
            <div className="field">
                <label htmlFor="descrizione">Descrizione</label>
                <InputTextarea id="descrizione" className="w-full" rows={5} value={formData.descrizione} 
                    onChange={(e) => setFormData({...formData, descrizione: e.target.value})} />
            </div>
            <Button label="Genera e Scarica PDF" icon="pi pi-file-pdf" loading={loading} onClick={handleSubmit} />
        </div>
    );
};

export default PdfForm;