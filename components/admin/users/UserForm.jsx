import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { ROLE_TRANSCODER } from '@/constants/roles';

const UserForm = ({ onSubmit, initialData }) => {
    
    // 1. Estraiamo isDirty e isSubmitting da formState
    const { 
        control, 
        handleSubmit, 
        setError,
        reset,
        formState: { errors, isDirty, isSubmitting } 
    } = useForm({
        defaultValues: initialData || {
            title: '',
            name: '',
            surname: '',
            email: '',
            roles: []
        }
    });

    // Reset del form se cambiano i dati iniziali (es. clicco su un altro utente)
    useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error block mt-1">{errors[name].message}</small>;
    };

    const roleOptions = Object.keys(ROLE_TRANSCODER).filter(key => key !== 'backoffice').map(key => ({
        value: key,
        label: ROLE_TRANSCODER[key].label,
        icon: ROLE_TRANSCODER[key].icon
    }));

    return (
        
        <form onSubmit={handleSubmit((data) => onSubmit(data, setError))} className="p-fluid">

            {/* Sezione Anagrafica */}
            <Divider align="left">
                <div className="inline-flex align-items-center">
                    <i className="pi pi-user mr-2"></i>
                    <b>ANAGRAFICA</b>
                </div>
            </Divider>

            <div className="grid">
                {/* Titolo */}
                <div className="field col-12 md:col-2">
                    <label htmlFor="title">Titolo</label>
                    <Controller name="title" control={control} render={({ field }) => (
                        <InputText id={field.name} {...field} disabled={isSubmitting} placeholder="Es. Dott.,Ing.,Prof." />
                    )} />
                </div>

                {/* Nome */}
                <div className="field col-12 md:col-5">
                    <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Nome *</label>
                    <Controller name="name" control={control} rules={{ required: 'Obbligatorio' }}
                        render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} disabled={isSubmitting} className={classNames({ 'p-invalid': fieldState.error })} />
                        )} 
                    />
                    {getFormErrorMessage('name')}
                </div>

                {/* Cognome */}
                <div className="field col-12 md:col-5">
                    <label htmlFor="surname" className={classNames({ 'p-error': errors.surname })}>Cognome *</label>
                    <Controller name="surname" control={control} rules={{ required: 'Obbligatorio' }}
                        render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} disabled={isSubmitting} className={classNames({ 'p-invalid': fieldState.error })} />
                        )} 
                    />
                    {getFormErrorMessage('surname')}
                </div>

                {/* Email */}
                <div className="field col-12">
                    <label htmlFor="email" className={classNames({ 'p-error': errors.email })}>Email *</label>
                    <Controller name="email" control={control} 
                        rules={{ 
                            required: 'Obbligatoria',
                            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email non valida' }
                        }}
                        render={({ field, fieldState }) => (
                            <InputText
                                id={field.name}
                                {...field}
                                disabled={isSubmitting}
                                className={classNames({ 'p-invalid': fieldState.error })}
                                placeholder="Verranno inviate le credenziali di accesso a questa email"
                            />
                        )} 
                    />
                    {getFormErrorMessage('email')}
                </div>
            </div>

            <Divider align="left" className="mt-5">
                <div className="inline-flex align-items-center">
                    <i className="pi pi-shield mr-2"></i>
                    <b>RUOLI</b>
                </div>
            </Divider>

            <div className="field col-12">
                <Controller name="roles" control={control} rules={{ required: 'Seleziona almeno un ruolo' }}
                    render={({ field, fieldState }) => (
                        <MultiSelect 
                            {...field}
                            options={roleOptions} 
                            disabled={isSubmitting}
                            placeholder="Scegli ruoli..." 
                            display="chip"
                            className={classNames({ 'p-invalid': fieldState.error })}
                        />
                    )} 
                />
                {getFormErrorMessage('roles')}
            </div>

            {/* BOTTONI AZIONE */}
            <div className="flex justify-content-end mt-6 gap-2">
                <Button 
                    type="submit" 
                    label="Salva Utente" 
                    icon="pi pi-save" 
                    severity="success" 
                    className="w-auto"
                    loading={isSubmitting} // PrimeReact mostra lo spinner automaticamente
                    disabled={!isDirty || isSubmitting} // Disabilitato se non modificato o se sta inviando
                />
            </div>
        </form>
    );
};

export default UserForm;