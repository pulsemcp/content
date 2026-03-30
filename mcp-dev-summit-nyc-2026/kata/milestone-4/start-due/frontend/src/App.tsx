import { useState, useEffect, useCallback } from 'react';
import { Issue } from './types';
import { fetchIssues, createIssue, updateIssue, deleteIssue } from './api';
import Sidebar from './components/Sidebar';
import IssueList from './components/IssueList';
import IssueDetail from './components/IssueDetail';
import CreateIssueModal from './components/CreateIssueModal';
import './App.css';

type View = 'list' | 'detail';

export default function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [view, setView] = useState<View>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadIssues = useCallback(async () => {
    try {
      const data = await fetchIssues();
      setIssues(data);
    } catch (err) {
      console.error('Failed to load issues:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  const handleSelectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setView('detail');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedIssue(null);
  };

  const handleCreateIssue = async (data: { title: string; description?: string; status?: string; priority?: string; due_date?: string | null }) => {
    await createIssue(data as any);
    await loadIssues();
    setShowCreateModal(false);
  };

  const handleUpdateIssue = async (id: number, data: Partial<Issue>) => {
    const updated = await updateIssue(id, data);
    setSelectedIssue(updated);
    await loadIssues();
  };

  const handleDeleteIssue = async (id: number) => {
    await deleteIssue(id);
    await loadIssues();
    setView('list');
    setSelectedIssue(null);
  };

  return (
    <div className="app">
      <Sidebar onCreateClick={() => setShowCreateModal(true)} />
      <main className="main-content">
        {view === 'list' ? (
          <IssueList
            issues={issues}
            loading={loading}
            onSelectIssue={handleSelectIssue}
            onCreateClick={() => setShowCreateModal(true)}
          />
        ) : selectedIssue ? (
          <IssueDetail
            issue={selectedIssue}
            onBack={handleBackToList}
            onUpdate={handleUpdateIssue}
            onDelete={handleDeleteIssue}
          />
        ) : null}
      </main>

      {showCreateModal && (
        <CreateIssueModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateIssue}
        />
      )}
    </div>
  );
}
