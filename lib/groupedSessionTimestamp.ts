// --- Date helpers ---
export interface ChatSession {
  sessionId: string;
  title: string;
  createdAt: string;
}

const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatMonthYear = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export const groupSessionsByDate = (sessions: ChatSession[]) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = startOfDay(
    new Date(now.getTime() - 24 * 60 * 60 * 1000)
  );
  const sevenDaysAgo = startOfDay(
    new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  );

  const groups: Record<string, ChatSession[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
  };

  const monthlyGroups: Record<string, ChatSession[]> = {};

  sessions.forEach((session) => {
    const sessionDate = new Date(session.createdAt);
    const sessionDay = startOfDay(sessionDate);

    if (sessionDay.getTime() === todayStart.getTime()) {
      groups.Today.push(session);
    } else if (sessionDay.getTime() === yesterdayStart.getTime()) {
      groups.Yesterday.push(session);
    } else if (sessionDay >= sevenDaysAgo && sessionDay < yesterdayStart) {
      groups["Previous 7 Days"].push(session);
    } else {
      const monthKey = formatMonthYear(session.createdAt);
      if (!monthlyGroups[monthKey]) monthlyGroups[monthKey] = [];
      monthlyGroups[monthKey].push(session);
    }
  });

  const sortedMonthly = Object.entries(monthlyGroups).sort(([a], [b]) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const result: [string, ChatSession[]][] = [];
  if (groups.Today.length) result.push(["Today", groups.Today]);
  if (groups.Yesterday.length) result.push(["Yesterday", groups.Yesterday]);
  if (groups["Previous 7 Days"].length)
    result.push(["Previous 7 Days", groups["Previous 7 Days"]]);
  result.push(...sortedMonthly);

  return result;
};
