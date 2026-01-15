"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NavigationMenu } from "../components/navigation-menu";
const RUC_STORAGE_KEY = 'current_ruc';
const LOGIN_URL = 'http://localhost:8080/auth';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Capturar RUC de la URL
    const rucFromUrl = searchParams?.get('ruc');
    console.log('RUC desde URL:', rucFromUrl);
    
    if (rucFromUrl) {
      console.log('[HomePage] Guardando RUC:', rucFromUrl);
      localStorage.setItem(RUC_STORAGE_KEY, rucFromUrl);
      
      // Limpiar URL
      window.history.replaceState({}, '', '/');
      return;
    }
    
    // Verificar RUC en localStorage
    const currentRuc = localStorage.getItem(RUC_STORAGE_KEY);
    console.log('[HomePage] RUC en localStorage:', currentRuc);
    
    if (!currentRuc) {
      console.warn('[HomePage] Sin RUC, redirigiendo...');
      alert('No se encontró RUC. Redirigiendo al login...');
      window.location.href = LOGIN_URL;
    }
  }, [searchParams, router]);

  return <NavigationMenu />;
}