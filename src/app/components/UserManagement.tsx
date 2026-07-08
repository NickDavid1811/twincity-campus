import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Filter, Edit2, Trash2, Shield, User, Mail, Phone, Calendar, MoreVertical } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'viewer';
  department: string;
  status: 'active' | 'inactive';
  phone: string;
  lastActive: string;
  joinedDate: string;
}

const mockUsers: UserData[] = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan.perez@campus.edu',
    role: 'admin',
    department: 'Tecnología',
    status: 'active',
    phone: '+34 612 345 678',
    lastActive: 'Hace 5 min',
    joinedDate: '2024-01-15'
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria.garcia@campus.edu',
    role: 'manager',
    department: 'Operaciones',
    status: 'active',
    phone: '+34 623 456 789',
    lastActive: 'Hace 1 hora',
    joinedDate: '2024-02-20'
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos.lopez@campus.edu',
    role: 'staff',
    department: 'Mantenimiento',
    status: 'active',
    phone: '+34 634 567 890',
    lastActive: 'Hace 3 horas',
    joinedDate: '2024-03-10'
  },
  {
    id: 4,
    name: 'Ana Martínez',
    email: 'ana.martinez@campus.edu',
    role: 'staff',
    department: 'Limpieza',
    status: 'active',
    phone: '+34 645 678 901',
    lastActive: 'Hace 30 min',
    joinedDate: '2024-04-05'
  },
  {
    id: 5,
    name: 'Pedro Sánchez',
    email: 'pedro.sanchez@campus.edu',
    role: 'viewer',
    department: 'Administración',
    status: 'inactive',
    phone: '+34 656 789 012',
    lastActive: 'Hace 2 días',
    joinedDate: '2023-11-20'
  },
  {
    id: 6,
    name: 'Laura Rodríguez',
    email: 'laura.rodriguez@campus.edu',
    role: 'manager',
    department: 'Seguridad',
    status: 'active',
    phone: '+34 667 890 123',
    lastActive: 'Hace 15 min',
    joinedDate: '2024-01-08'
  },
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: 'bg-destructive/10 text-destructive border-destructive/20',
      manager: 'bg-primary/10 text-primary border-primary/20',
      staff: 'bg-success/10 text-success border-success/20',
      viewer: 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20',
    };
    return badges[role as keyof typeof badges] || badges.viewer;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const usersByRole = {
    admin: mockUsers.filter(u => u.role === 'admin').length,
    manager: mockUsers.filter(u => u.role === 'manager').length,
    staff: mockUsers.filter(u => u.role === 'staff').length,
    viewer: mockUsers.filter(u => u.role === 'viewer').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground mb-1">Gestión de Usuarios</h1>
          <p className="text-sm text-muted-foreground">Administrar accesos y roles del sistema</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4 inline mr-2" />
          Nuevo Usuario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-destructive/10">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl text-foreground">{usersByRole.admin}</p>
              <p className="text-sm text-muted-foreground">Administradores</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl text-foreground">{usersByRole.manager}</p>
              <p className="text-sm text-muted-foreground">Gestores</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-success/10">
              <User className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl text-foreground">{usersByRole.staff}</p>
              <p className="text-sm text-muted-foreground">Personal</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-muted">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl text-foreground">{usersByRole.viewer}</p>
              <p className="text-sm text-muted-foreground">Visualizadores</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="manager">Gestor</option>
            <option value="staff">Personal</option>
            <option value="viewer">Visualizador</option>
          </select>

          <button className="px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4 inline mr-2" />
            Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Rol</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Departamento</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Última actividad</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-secondary/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border ${getRoleBadge(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{user.department}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded text-xs ${
                      user.status === 'active'
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{user.lastActive}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-card border border-border rounded-lg max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground text-xl">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl text-foreground mb-1">{selectedUser.name}</h2>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border ${getRoleBadge(selectedUser.role)}`}>
                    {getRoleIcon(selectedUser.role)}
                    {selectedUser.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </p>
                <p className="text-foreground">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Teléfono
                </p>
                <p className="text-foreground">{selectedUser.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Departamento</p>
                <p className="text-foreground">{selectedUser.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Estado</p>
                <span className={`inline-flex px-2.5 py-1 rounded text-xs ${
                  selectedUser.status === 'active'
                    ? 'bg-success/10 text-success'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {selectedUser.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de ingreso
                </p>
                <p className="text-foreground">{selectedUser.joinedDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Última actividad</p>
                <p className="text-foreground">{selectedUser.lastActive}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Editar Usuario
              </button>
              <button className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                Desactivar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
