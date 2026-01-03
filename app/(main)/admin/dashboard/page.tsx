/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/layout/context/authcontext';
import LastLogin from '@/components/common/LastLogin';
import UserStats from '@/components/stats/UserStats';

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

            <div className="hidden xl:block xl:col-9"></div>

            <div className="col-12 lg:col-6 xl:col-6">
                <UserStats hiddenBackoffice={true} />
            </div>

        </div>
    );
};

export default Dashboard;
