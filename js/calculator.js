// Calculadora de faltas: a mesma regra do app (regras de domínio do app, "Faltas — contadas em dias de aula"),
// com aulas por dia inteiras:
//   diasDeAula = max(1, round(cargaHoraria × 60 ÷ (aulasPorDia × duracaoAulaMin)))
//   limite     = floor(diasDeAula × (1 − presencaMinima ÷ 100))

export const CALC_DEFAULTS = {
  workloadHours: 60,
  classesPerDay: 2,
  classMinutes: 55,
  minAttendance: 75,
};

/**
 * @param {{ workloadHours: number, classesPerDay: number, classMinutes: number, minAttendance: number }} input
 */
export function calculateAbsences({ workloadHours, classesPerDay, classMinutes, minAttendance }) {
  const classDays = Math.max(1, Math.round((workloadHours * 60) / (classesPerDay * classMinutes)));
  const limit = Math.floor(classDays * (1 - minAttendance / 100));
  return {
    classDays,
    limit,
    unit: limit === 1 ? 'dia de aula' : 'dias de aula',
    how: `${workloadHours} h ÷ (${classesPerDay} × ${classMinutes} min) = ${classDays} dias de aula. ${100 - minAttendance}% disso = ${limit}.`,
  };
}
