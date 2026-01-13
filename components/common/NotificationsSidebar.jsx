// layout/components/NotificationsSidebar.js
import React, { useEffect, useState } from 'react';

import { Sidebar } from 'primereact/sidebar';
import { ProgressSpinner } from 'primereact/progressspinner';

import { notificationsService } from '@/services/notifications/notificationsService'; 

const NotificationsSidebar = ({ visible, onHide, markAllAsRead }) => {

    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Creiamo la funzione async interna
        const fetchNotifications = async () => {
            if (visible) {
                setLoading(true);
                try {
                    const response = await notificationsService.getNotifications();
                    setNotifications(response.data.notifications);
                } catch (error) {
                    setNotifications([
                        {
                            "id": "0",
                            "data": {
                                "sender_id": 1,
                                "title": "ERRORE!",
                                "message": "Si è verificato un errore nel caricamento delle notifiche.",
                                "action_url": null,
                                "read_at": 'yesterday'
                            }
                        }
                    ]);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchNotifications();
    }, [visible]); // Esegue ogni volta che la visibilità cambia
    
    return (
        <Sidebar visible={visible} onHide={onHide} position="right" style={{ width: '34rem' }}>
            <div className="p-3">
                {/* Header della Sidebar opzionale */}
                <div className="flex justify-content-between align-items-center mb-4">
                    <h3 className="m-0 text-xl font-bold">Notifiche</h3>
                    {notifications.length > 0 && !loading && (
                        <button className="p-link text-blue-600 text-sm font-medium" onClick={() => {markAllAsRead()}}>
                            Segna tutte come lette
                        </button>
                    )}
                </div>

                {loading ? (
                    /* Stato di Caricamento */
                    <div className="flex flex-column align-items-center justify-content-center" style={{ height: '200px' }}>
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
                        <span className="mt-3 text-500">Caricamento in corso...</span>
                    </div>
                ) : (
                    /* Lista Notifiche (quando non sta caricando) */
                    <div className="flex flex-column gap-2">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div 
                                    key={notif.id} 
                                    className={`p-3 border-round border-1 transition-colors transition-duration-200 ${
                                        !notif.read_at 
                                        ? 'bg-blue-50 border-blue-100' 
                                        : 'bg-white border-1 surface-border hover:surface-100'
                                    }`}
                                >
                                    <div className="flex align-items-start gap-3">
                                        {/* Icona indicatore stato */}
                                        <div className="flex flex-column align-items-center">
                                            <i className={`pi ${!notif.read_at ? 'pi-circle-fill text-blue-500' : 'pi-bell text-400'} text-sm`}></i>
                                        </div>

                                        {/* Contenuto Notifica */}
                                        <div className="flex flex-column flex-1">
                                            <div className="flex justify-content-between align-items-center mb-1">
                                                <span className={`text-sm ${!notif.read_at ? 'font-bold text-blue-900' : 'text-700'}`}>
                                                    {notif.data.title}
                                                </span>
                                                <span className="text-xs text-500">
                                                    {/* Se non hai inviato created_at, puoi ometterlo */}
                                                    {notif.created_at ? new Date(notif.created_at).toLocaleDateString() : ''}
                                                </span>
                                            </div>
                                            
                                            <p className={`m-0 text-sm lineHeight-2 ${!notif.read_at ? 'text-blue-700' : 'text-600'}`}>
                                                {notif.data.message}
                                            </p>
                                        </div>

                                        {/* Badge "Nuova" */}
                                        {!notif.read_at && (
                                            <span className="bg-blue-500 text-white border-round px-2 py-1 text-xs font-bold uppercase">
                                                Nuova
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Stato Vuoto */
                            <div className="text-center p-5 surface-100 border-round">
                                <i className="pi pi-inbox text-4xl text-300 mb-3"></i>
                                <p className="m-0 text-500">Non hai ancora nessuna notifica.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Sidebar>
    );
};

export default NotificationsSidebar;