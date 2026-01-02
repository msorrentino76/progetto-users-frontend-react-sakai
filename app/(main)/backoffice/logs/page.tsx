'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';

import { logService } from '@/services/backoffice/logService';

import { confirmDialog } from 'primereact/confirmdialog';

const LogsPage = () => {
        
    const [logFiles, setLogFiles] = useState([]);
    const [logFile, setLogFile] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logContent, setLogContent] = useState('');

    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(logContent);
            setCopied(true);
            // Ripristina l'icona dopo 2 secondi
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Errore durante la copia:', err);
        }
    };

    const toast = useRef(null);
    
    useEffect(() => {
        const fetchLogs = async () => { 
            try {
                const response = await logService.getLogs();
                setLogFiles(response.data);
            } catch (error) {
                console.error('Errore nel recupero dei log:', error);
                toast.current.show({severity:'error', summary: 'Errore', detail: error.response.data.message, life: 3000});
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-search" size="small" className="mr-2" tooltip="Dettaglio Log" severity="info"  tooltipOptions={{ position: 'top' }} onClick={() => detailsLog(rowData.filename)} />
                <Button icon="pi pi-trash"  size="small" className="mr-2" tooltip="Cancella Log"  severity="danger" tooltipOptions={{ position: 'top' }} onClick={() => deleteLog(rowData.filename)} />
            </React.Fragment>
        );
    };

    const detailsLog = async (filename) => {
        setLoading(true);  
        setLogFile(filename);
        try {
            const response = await logService.getLogDetails(filename);
            setLogContent(response.data.content);
        } catch (error) {
            console.error('Errore nel recupero dei log:', error);
            toast.current.show({severity:'error', summary: 'Errore', detail: error.response.data.message, life: 3000});
        } finally {
            setLoading(false); 
        }   
    };
    
    const deleteLog = (filename) => {
        // Logica per eliminare il log
        confirmDialog({
            message:'Sei sicuro di voler cancellare questo log?',
            header: 'Conferma Eliminazione',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sì',
            rejectLabel: 'No',
            accept: async () => {
                setLoading(true);
                try {
                    await logService.deleteLog(filename);
                    setLogFiles(logFiles.filter(log => log.filename !== filename));
                    toast.current.show({severity:'success', summary: 'Successo', detail: 'Operazione conclusa con successo', life: 3000});
                } catch (error) {
                    console.error('Errore nel recupero dei log:', error);
                    toast.current.show({severity:'error', summary: 'Errore', detail: error.response.data.message, life: 3000});
                } finally {
                    setLoading(false); 
                }
            } 
        });
    } 
    return (
        <div className="card">
            <div className="grid">

                <div className="col-12">
                    <h5>Log di sistema</h5>
                    <p className="pb-4 text-600">
                        Visualizza e gestisci i log di sistema.
                    </p>
                </div>

                <div className="col-12">
                    <DataTable value={logFiles} loading={loading} className="datatable-responsive" sortField="filename" sortOrder={-1}
                        emptyMessage="Nessun file di log trovato.">
                        <Column header="Azioni" body={actionBodyTemplate}></Column>
                        <Column field="filename" header="Nome File" sortable></Column>
                        <Column field="size" header="Dimensione"></Column>
                    </DataTable>
                </div>
                
                <div className="col-12">
                    {logContent && 
                        <>
                            <Toolbar className="mb-4" left={<>{logFile}</>} right={
                                <Button 
                                    type="button"
                                    icon={copied ? "pi pi-check" : "pi pi-copy"} 
                                    label={copied ? "Copiato!" : "Copia Log"} 
                                    className={copied ? "p-button-success" : "p-button-outlined"} 
                                    onClick={copyToClipboard}
                                    tooltip="Copia negli appunti"
                                    tooltipOptions={{ position: 'bottom' }}
                                />
                            }></Toolbar>
                            <pre style={{ 
                                backgroundColor: '#1e1e1e', 
                                color: '#d4d4d4', 
                                padding: '1rem', 
                                borderRadius: '8px',
                                fontSize: '12px',
                                overflowX: 'auto' 
                            }}>
                                {logContent}
                            </pre>
                        </>
                    }
                </div>

            </div>

            <Toast ref={toast} />

        </div>
    );
};

export default LogsPage;