import React, { createContext, useContext, useState } from 'react';
import { INITIAL_COOPERATIVES, INITIAL_AUDITS, INITIAL_TASKS } from '../data/mockData';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [cooperatives, setCooperatives] = useState(INITIAL_COOPERATIVES || []);
  const [audits, setAudits] = useState(INITIAL_AUDITS || []);
  const [tasks, setTasks] = useState(INITIAL_TASKS || []);

  const getCooperativeById = (id) => {
    return cooperatives.find((coop) => coop.id === parseInt(id));
  };

  const addCooperative = (cooperative) => {
    const newCoop = {
      ...cooperative,
      id: Math.max(...cooperatives.map((c) => c.id), 0) + 1,
    };
    setCooperatives([...cooperatives, newCoop]);
    return newCoop;
  };

  const updateCooperative = (id, updates) => {
    setCooperatives(
      cooperatives.map((coop) =>
        coop.id === parseInt(id) ? { ...coop, ...updates } : coop
      )
    );
  };

  const deleteCooperative = (id) => {
    setCooperatives(cooperatives.filter((coop) => coop.id !== parseInt(id)));
    setAudits(audits.filter((audit) => audit.cooperativeId !== parseInt(id)));
    setTasks(tasks.filter((task) => task.cooperativeId !== parseInt(id)));
  };

  const getAuditsByCooperative = (cooperativeId) => {
    return audits.filter((audit) => audit.cooperativeId === parseInt(cooperativeId));
  };

  const addAudit = (audit) => {
    const newAudit = {
      ...audit,
      id: Math.max(...audits.map((a) => a.id), 0) + 1,
      notes: audit.notes || [],
    };
    setAudits([...audits, newAudit]);
    return newAudit;
  };

  const updateAudit = (id, updates) => {
    setAudits(
      audits.map((audit) =>
        audit.id === parseInt(id) ? { ...audit, ...updates } : audit
      )
    );
  };

  const addAuditNote = (auditId, note) => {
    setAudits(
      audits.map((audit) => {
        if (audit.id === parseInt(auditId)) {
          return {
            ...audit,
            notes: [...audit.notes, { ...note, date: new Date().toISOString().split('T')[0] }],
          };
        }
        return audit;
      })
    );
  };

  const getTasksByCooperative = (cooperativeId) => {
    return tasks.filter((task) => task.cooperativeId === parseInt(cooperativeId));
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Math.max(...tasks.map((t) => t.id), 0) + 1,
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = (id, updates) => {
    setTasks(
      tasks.map((task) =>
        task.id === parseInt(id) ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== parseInt(id)));
  };

  const value = {
    cooperatives,
    audits,
    tasks,
    getCooperativeById,
    addCooperative,
    updateCooperative,
    deleteCooperative,
    getAuditsByCooperative,
    addAudit,
    updateAudit,
    addAuditNote,
    getTasksByCooperative,
    addTask,
    updateTask,
    deleteTask,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
