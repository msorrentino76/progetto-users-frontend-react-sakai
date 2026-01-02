'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';

import { useAuth } from '@/layout/context/authcontext';
import {usersService} from '@/services/admin/usersService';
import {formatDate} from '@/lib/utils';

const UsersPage = () => {

    const { user } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // stato per il loader
    const [refresh, refreshThis] = useState(Date.now());
    // refreshThis(Date.now());

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await usersService.getAllUsers();
                setUsers(response.data);
            } catch (error) {
                toast.current.show({severity:'error', summary: 'Errore', detail: 'Errore generico', life: 3000});
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [refresh]);

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Crea Utente" icon="pi pi-plus" severity="success" onClick={newUser} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        <></>
        //return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={() => {}} />;
    };

    const rolesTemplate = (rowData) => {
        return rowData.roles.join(', ');
    };

    const disabledTemplate = (rowData) => {
        return rowData.disabled ?
        <i className="pi pi-times text-red-500 mr-2"></i>
        :
        <i className="pi pi-check text-green-500 mr-2"></i>;
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-search" size="small" className="mr-2" tooltip="Dettaglio Utente"  severity="info"    tooltipOptions={{ position: 'top' }} onClick={() => detailsUser(rowData)} />
                <Button icon="pi pi-pencil" size="small" className="mr-2" tooltip="Modifica Utente"                      tooltipOptions={{ position: 'top' }} onClick={() => editUser(rowData)} />
                {rowData.disabled ?
                <Button icon="pi pi-user" disabled={rowData.id == user.id} size="small" className="mr-2" tooltip="Abilita Utente"    severity="warning" tooltipOptions={{ position: 'top' }} onClick={() => toggleBan(rowData)} />
                :
                <Button icon="pi pi-ban"  disabled={rowData.id == user.id} size="small" className="mr-2" tooltip="Disabilita Utente" severity="warning" tooltipOptions={{ position: 'top' }} onClick={() => toggleBan(rowData)} />
                }
                <Button icon="pi pi-trash" disabled={rowData.id == user.id} size="small" className="mr-2" tooltip="Elimina Utente"   severity="danger"  tooltipOptions={{ position: 'top' }} onClick={() => deleteUser(rowData)}/>
                <Button icon="pi pi-key"    size="small" className="mr-2" tooltip="Resetta Password" severity="success" tooltipOptions={{ position: 'top' }} onClick={() => resetPassword(rowData)}/>
            </React.Fragment>
        );
    };

    const [filters, setFilters] = useState({
        global:  { value: null, matchMode: FilterMatchMode.CONTAINS },
        surname: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name:    { value: null, matchMode: FilterMatchMode.CONTAINS },
        roles:   { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [roles] = useState(['admin', 'user']);

    const rolesRowFilterTemplate = (options) => {
        return (
            <Dropdown 
                value={options.value}
                options={roles}
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Seleziona ruolo" className="p-column-filter" showClear/>
        );
    }
    const toast = useRef(null);

    const newUser = () => {
        // Logica per creare un nuovo utente
        console.log('Nuovo utente');
    }
    const detailsUser = (user) => {
        // Logica per visualizzare i dettagli dell'utente
        console.log('Dettagli utente:', user);
    }
    const editUser = (user) => {
        // Logica per modificare l'utente
        console.log('Modifica utente:', user);
    }
    const toggleBan = (user) => {
        // Logica per abilitare/disabilitare l'utente
        confirmDialog({
            message: user.disabled ? 
                    <>
                        Sei sicuro di voler abilitare questo utente?
                        <br/><br/>
                        <span className="font-bold">L'utente potrà accedere nuovamente al sistema.</span>
                    </>
                    : 
                    <>
                        Sei sicuro di voler disabilitare questo utente?
                        <br/><br/>
                        <span className="font-bold">L'utente non verrà rimosso dal sistema ma non potrà accedervi finchè risulta disabilitato.</span>
                    </>,
            header: user.disabled ? 'Conferma Abilitazione' : 'Conferma Disabilitazione',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sì',
            rejectLabel: 'No',
            accept: async () => {
                setLoading(true);
                try {
                    await usersService.toggleUserBan(user.id);
                    toast.current.show({severity:'success', summary: 'Successo', detail: 'Operazione conclusa con successo', life: 3000});
                    refreshThis(Date.now());
                } catch (error) {
                    if (error.response && error.response.status === 422) {
                        toast.current.show({severity:'error', summary: 'Errore', detail: error.response.data.message, life: 3000});
                    } else {
                        console.error('Errore generico:', error);
                        toast.current.show({severity:'error', summary: 'Errore', detail: 'Errore generico', life: 3000});
                    }
                    setLoading(false);
                } 
            }, 
        });
    }
    const deleteUser = (user) => {
        // Logica per eliminare l'utente
        confirmDialog({
            message:'Sei sicuro di voler cancellare questo utente?',
            header: 'Conferma Eliminazione',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sì',
            rejectLabel: 'No',
            accept: async () => {
                setLoading(true);
                try {
                    await usersService.deleteUser(user.id);
                    toast.current.show({severity:'success', summary: 'Successo', detail: 'Operazione conclusa con successo', life: 3000});
                    refreshThis(Date.now());
                } catch (error) {
                    if (error.response && error.response.status === 422) {
                        toast.current.show({severity:'error', summary: 'Errore', detail: error.response.data.message, life: 3000});
                    } else {
                        console.error('Errore generico:', error);
                        toast.current.show({severity:'error', summary: 'Errore', detail: 'Errore generico', life: 3000});
                    }
                    setLoading(false);
                } 
            }, 
        });
    }       
    const resetPassword = (user) => {
        // Logica per resettare la password dell'utente
        console.log('Resetta password per utente con ID:', user.id);
    }

    return (
        <>
            <div className="card">
                <div className="grid">
                    <div className="col-12">
                    
                        <h5>Gestione Utenti</h5>

                        <p className="pb-4 text-600">
                            Visualizza e gestisci i permessi degli utenti del sistema.
                        </p>

                        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        <DataTable
                            value={users}
                            stripedRows
                            paginator
                            rows={10}
                            loading={loading}
                            className="datatable-responsive"
                            emptyMessage="Nessun utente trovato."
                            filterDisplay="row"
                            filters={filters}                       // <--- Usa lo stato dei filtri
                            onFilter={(e) => setFilters(e.filters)} // <--- Aggiorna lo stato al cambio
                        >
                            {/* <Column field="title" header="Titolo"></Column> */}
                            <Column field="surname" filter filterPlaceholder="Cognome" showFilterMenu={false} header="Cognome" sortable></Column>
                            <Column field="name"    filter filterPlaceholder="Nome" showFilterMenu={false} header="Nome" sortable></Column>                            
                            <Column field="roles"   filter filterElement={rolesRowFilterTemplate} showFilterMenu={false} header="Ruoli" body={rolesTemplate}></Column>
                            <Column field="disabled" sortable header="Abilitato" body={disabledTemplate} bodyClassName="text-center" headerStyle={{ width: '5rem', textAlign: 'center' }}></Column>
                            {/* <Column field="updated_at" header="Aggiornato il" body={(rowData) => formatDate(rowData.updated_at)}></Column> */}
                            <Column header="Azioni" body={actionBodyTemplate} exportable={false} style={{width: '20rem'}}></Column>
                        </DataTable>

                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </>
    );
}
export default UsersPage;
