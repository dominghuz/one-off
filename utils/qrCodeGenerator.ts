// utils/qrCodeGenerator.ts - Utilitário para geração de QR Codes
import { generateQRCodeSession, type Modulo, type Disciplina } from '../lib/database';

export interface QRCodeData {
  moduloId: number;
  disciplina: string;
  modulo: string;
  date: string;
  period: 'Manhã' | 'Tarde' | 'Noite';
  classroom: string;
  startTime: string;
  endTime: string;
  generatedAt: string;
}

export class QRCodeGenerator {
  
  /**
   * Gera dados estruturados para QR Code
   */
  static generateQRData(
    modulo: Modulo, 
    disciplina: Disciplina, 
    date: string
  ): QRCodeData {
    return {
      moduloId: modulo.id,
      disciplina: disciplina.name,
      modulo: modulo.name,
      date: date,
      period: modulo.period,
      classroom: modulo.classroom,
      startTime: modulo.startTime,
      endTime: modulo.endTime,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Converte dados do QR Code para string JSON
   */
  static dataToString(qrData: QRCodeData): string {
    return JSON.stringify(qrData);
  }

  /**
   * Converte string JSON para dados do QR Code
   */
  static stringToData(qrString: string): QRCodeData | null {
    try {
      const data = JSON.parse(qrString);
      
      // Validar estrutura básica
      if (!data.moduloId || !data.disciplina || !data.modulo || !data.date) {
        return null;
      }
      
      return data as QRCodeData;
    } catch (error) {
      console.error('Erro ao parsear QR Code:', error);
      return null;
    }
  }

  /**
   * Valida se um QR Code é válido e não expirou
   */
  static validateQRCode(qrString: string): {
    isValid: boolean;
    data?: QRCodeData;
    error?: string;
  } {
    const data = this.stringToData(qrString);
    
    if (!data) {
      return {
        isValid: false,
        error: 'QR Code inválido ou corrompido'
      };
    }

    // Verificar se não expirou (4 horas após geração)
    const generatedAt = new Date(data.generatedAt);
    const now = new Date();
    const diffInHours = (now.getTime() - generatedAt.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours > 4) {
      return {
        isValid: false,
        data,
        error: 'QR Code expirado'
      };
    }

    // Verificar se é para o dia correto
    const qrDate = new Date(data.date);
    const today = new Date();
    
    // Comparar apenas a data (ignorar horário)
    const qrDateString = qrDate.toDateString();
    const todayString = today.toDateString();
    
    if (qrDateString !== todayString) {
      return {
        isValid: false,
        data,
        error: 'QR Code não é para hoje'
      };
    }

    return {
      isValid: true,
      data
    };
  }

  /**
   * Gera QR Code para múltiplos módulos de uma vez
   */
  static async generateBulkQRCodes(
    modulos: Modulo[],
    date: string
  ): Promise<Array<{
    modulo: Modulo;
    qrCodeSession: any;
    success: boolean;
    error?: string;
  }>> {
    const results = [];
    
    for (const modulo of modulos) {
      try {
        const qrCodeSession = await generateQRCodeSession(modulo.id, date);
        results.push({
          modulo,
          qrCodeSession,
          success: true
        });
      } catch (error) {
        results.push({
          modulo,
          qrCodeSession: null,
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
    
    return results;
  }

  /**
   * Gera QR Codes para uma semana inteira
   */
  static async generateWeeklyQRCodes(
    modulos: Modulo[],
    startDate: Date
  ): Promise<{
    success: number;
    failed: number;
    results: Array<{
      date: string;
      dayOfWeek: number;
      modulos: Array<{
        modulo: Modulo;
        qrCodeSession: any;
        success: boolean;
        error?: string;
      }>;
    }>;
  }> {
    const results = [];
    let totalSuccess = 0;
    let totalFailed = 0;
    
    // Gerar para 7 dias
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayOfWeek = currentDate.getDay();
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Filtrar módulos para este dia da semana
      const modulosParaODia = modulos.filter(m => m.dayOfWeek === dayOfWeek && m.isActive);
      
      if (modulosParaODia.length > 0) {
        const dayResults = await this.generateBulkQRCodes(modulosParaODia, dateString);
        
        // Contar sucessos e falhas
        dayResults.forEach(result => {
          if (result.success) {
            totalSuccess++;
          } else {
            totalFailed++;
          }
        });
        
        results.push({
          date: dateString,
          dayOfWeek,
          modulos: dayResults
        });
      }
    }
    
    return {
      success: totalSuccess,
      failed: totalFailed,
      results
    };
  }

  /**
   * Formata dados do QR Code para exibição
   */
  static formatQRDataForDisplay(data: QRCodeData): {
    title: string;
    subtitle: string;
    details: Array<{ label: string; value: string }>;
  } {
    return {
      title: data.disciplina,
      subtitle: data.modulo,
      details: [
        { label: 'Data', value: new Date(data.date).toLocaleDateString('pt-AO') },
        { label: 'Período', value: data.period },
        { label: 'Horário', value: `${data.startTime} - ${data.endTime}` },
        { label: 'Sala', value: data.classroom },
        { label: 'Gerado em', value: new Date(data.generatedAt).toLocaleString('pt-AO') }
      ]
    };
  }

  /**
   * Gera nome de arquivo para QR Code
   */
  static generateFileName(data: QRCodeData): string {
    const date = new Date(data.date).toISOString().split('T')[0];
    const disciplinaSlug = data.disciplina.toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    
    return `qr_${disciplinaSlug}_${date}_${data.startTime.replace(':', '')}.png`;
  }

  /**
   * Calcula estatísticas de QR Codes gerados
   */
  static calculateQRCodeStats(qrCodeSessions: any[]): {
    total: number;
    active: number;
    expired: number;
    byPeriod: { [key: string]: number };
    byDay: { [key: string]: number };
  } {
    const now = new Date();
    
    const stats = {
      total: qrCodeSessions.length,
      active: 0,
      expired: 0,
      byPeriod: { 'Manhã': 0, 'Tarde': 0, 'Noite': 0 },
      byDay: {}
    };

    qrCodeSessions.forEach(session => {
      const expiresAt = new Date(session.expiresAt);
      
      if (session.isActive && expiresAt > now) {
        stats.active++;
      } else {
        stats.expired++;
      }

      try {
        const qrData = JSON.parse(session.qrCodeData);
        
        // Contar por período
        if (qrData.period) {
          stats.byPeriod[qrData.period] = (stats.byPeriod[qrData.period] || 0) + 1;
        }
        
        // Contar por dia
        if (qrData.date) {
          const dayName = new Date(qrData.date).toLocaleDateString('pt-AO', { weekday: 'long' });
          stats.byDay[dayName] = (stats.byDay[dayName] || 0) + 1;
        }
      } catch (error) {
        console.error('Erro ao processar dados do QR Code:', error);
      }
    });

    return stats;
  }
}

export default QRCodeGenerator;

