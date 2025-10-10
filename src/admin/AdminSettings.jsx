// src/admin/AdminSettings.jsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Manage system configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Settings panel content will go here.</p>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;