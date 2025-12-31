'use client';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';

import {usersService} from '@/services/admin/usersService';

const UsersPage = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // stato per il loader

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await usersService.getAllUsers();
                setUsers(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                {loading ?
                    <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        <ProgressSpinner />
                    </div>
                : <>
                
                        <h5>Gestione Utenti</h5>

                        <p className="pb-4 text-600">
                            Visualizza e gestisci i permessi degli utenti del sistema.
                        </p>

                        <DataTable value={users} paginator rows={10}>
                            <Column field="id" header="ID" sortable></Column>
                            <Column field="name" header="Name" sortable></Column>
                            <Column field="price" header="Price" sortable></Column>
                            <Column field="category" header="Category" sortable></Column>
                        </DataTable>
                    </>
                }

                </div>
            </div>
        </div>
    );
}
export default UsersPage;
