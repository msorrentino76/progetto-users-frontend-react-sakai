'use client';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';

import api from '@/services/api';

const Tabella = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // stato per il loader

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/example/tabella');
                setProducts(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="card">
          {loading ?
            <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <ProgressSpinner />
            </div>
         : 
            <>
              <h5>Basic DataTable</h5>
              <DataTable value={products} paginator rows={10}>
                  <Column field="id" header="ID" sortable></Column>
                  <Column field="name" header="Name" sortable></Column>
                  <Column field="price" header="Price" sortable></Column>
                  <Column field="category" header="Category" sortable></Column>
              </DataTable>
            </>
          }
        </div>
    )
}
export default Tabella;
