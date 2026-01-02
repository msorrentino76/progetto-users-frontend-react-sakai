/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/layout/context/authcontext';
import LastLogin from '@/components/common/LastLogin';

const Dashboard = () => {

    const { user } = useAuth();

    return (
        <div className="grid">

            <div className="col-12">
                <h2>Benvenuto {user?.title} {user?.surname} {user?.name}</h2>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <LastLogin />
            </div>

        </div>
    );
};

export default Dashboard;
