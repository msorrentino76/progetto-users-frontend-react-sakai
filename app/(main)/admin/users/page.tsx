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
import { Dialog } from 'primereact/dialog';

import { useAuth } from '@/layout/context/authcontext';
import {usersService} from '@/services/admin/usersService';
import {_role, ROLE_TRANSCODER} from '@/constants/roles';

import Details from '@/components/admin/users/Details';
import UserForm from '@/components/admin/users/UserForm';
import { set } from 'react-hook-form';

const UsersPage = () => {

    const { user } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // stato per il loader
    const [refresh, refreshThis] = useState(Date.now());
    // refreshThis(Date.now());

    const [dialogData, setDialogData] = useState(false);
    const [dialogHeader, setDialogHeader] = useState('');

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
        return rowData.roles.map(role => _role(role).label).join(', ');
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
                <Button icon="pi pi-user" disabled={rowData.id == user.id} size="small" className="mr-2" tooltip="Abilita Utente"    severity={rowData.id == user.id ? 'secondary' : 'warning'} tooltipOptions={{ position: 'top' }} onClick={() => toggleBan(rowData)} />
                :
                <Button icon="pi pi-ban"  disabled={rowData.id == user.id} size="small" className="mr-2" tooltip="Disabilita Utente" severity={rowData.id == user.id ? 'secondary' : 'warning'} tooltipOptions={{ position: 'top' }} onClick={() => toggleBan(rowData)} />
                }
                <Button icon="pi pi-trash" disabled={rowData.id == user.id} size="small" className="mr-2" tooltip="Elimina Utente"   severity={rowData.id == user.id ? 'secondary' : 'danger'}  tooltipOptions={{ position: 'top' }} onClick={() => deleteUser(rowData)}/>
                <Button icon="pi pi-key"   disabled={rowData.id == user.id} size="small" className="mr-2" tooltip="Resetta Password" severity={rowData.id == user.id ? 'secondary' : 'success'} tooltipOptions={{ position: 'top' }} onClick={() => resetPassword(rowData)}/>
            </React.Fragment>
        );
    };

    const [filters, setFilters] = useState({
        global:  { value: null, matchMode: FilterMatchMode.CONTAINS },
        surname: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name:    { value: null, matchMode: FilterMatchMode.CONTAINS },
        roles:   { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const roles = Object.keys(ROLE_TRANSCODER)
        .filter(key => key !== 'backoffice')
        .map(key => ({value: key, label:ROLE_TRANSCODER[key].label}));

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

    const handleSave = async (userData, userId, setError) => {
        try {
            await usersService.saveUser(userId, userData);
            toast.current.show({severity:'success', summary: 'Successo', detail: 'Operazione conclusa con successo', life: 3000});
            refreshThis(Date.now());
            setDialogData(false);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                //toast.current.show({severity:'error', summary: 'Errore', detail: error.response.data.message, life: 3000});
                const serverErrors = error.response.data.errors; // Laravel risponde con un oggetto 'errors'
                
                // Cicliamo gli errori che arrivano dal server
                Object.keys(serverErrors).forEach((fieldName) => {
                    setError(fieldName, {
                        type: 'server',
                        message: serverErrors[fieldName][0] // Prende il primo messaggio (es: "Email già presente")
                    });
                });
            } else {
                console.error('Errore generico:', error);
                toast.current.show({severity:'error', summary: 'Errore', detail: 'Errore generico', life: 3000});
            }
        }
    };
    const newUser = () => {
        // Logica per creare un nuovo utente
        setDialogHeader('Nuovo Utente');
        setDialogData(<UserForm onSubmit={(userData, setError) => handleSave(userData, null, setError)} />);
    }
    const editUser = (user) => {
        // Logica per modificare l'utente
        setDialogHeader('Modifica Utente');
        setDialogData(<UserForm onSubmit={(userData, setError) => handleSave(userData, user.id, setError)} initialData={user}/>);
    }
    const detailsUser = (user) => {
        // Logica per visualizzare i dettagli dell'utente
        setDialogHeader('Dettaglio Utente');
        setDialogData(<Details user={user} />);
    }
    const toggleBan = (user) => {
        // Logica per abilitare/disabilitare l'utente
        confirmDialog({
            message: user.disabled ? 
                    <>
                        Sei sicuro di voler abilitare l'utente {user.name} {user.surname}?
                        <br/><br/>
                        <span className="font-bold">L'utente potrà accedere nuovamente al sistema.</span>
                    </>
                    : 
                    <>
                        Sei sicuro di voler disabilitare l'utente {user.name} {user.surname}?
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
            message: `Sei sicuro di voler cancellare l'utente ${user.name} ${user.surname}?`,
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
        confirmDialog({
            message:<>
                       Sei sicuro di voler resettare la password dell'utente {user.name} {user.surname}?
                        <br/><br/>
                        <span className="font-bold">L'utente riceverà una nuova password all'email {user.email}.</span>
                    </>,
            header: 'Conferma Reset Password',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sì',
            rejectLabel: 'No',
            accept: async () => {
                setLoading(true);
                try {
                    await usersService.resetPasswordUser(user.id);
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
            <Dialog header={dialogHeader} visible={dialogData} style={{ width: '50vw' }} onHide={() => {if (!dialogData) return; setDialogData(false); }}>
                {dialogData}
            </Dialog>
        </>
    );
}
export default UsersPage;
