
import React, { useState, useEffect, createContext, useContext } from 'react';
import {
    FaUserShield, FaGavel, FaUsers, FaClipboardList, FaFileAlt, FaTasks,
    FaArrowLeft, FaSearch, FaBell, FaSignOutAlt, FaPlus, FaEdit, FaTrash,
    FaCheckCircle, FaExclamationTriangle, FaHourglassHalf, FaTimesCircle,
    FaRegClock, FaCalendarAlt, FaCalendarCheck, FaChartBar, FaChartPie, FaChartLine, FaGauge,
    FaInfoCircle, FaDownload, FaSpinner, FaHistory, FaEye, FaFileUpload, FaPaperclip, FaHammer
} from 'react-icons/fa';
import { MdOutlineWork, MdOutlineDescription } from 'react-icons/md';

// --- Dummy Data (MANDATORY - NO EMPTY STATES) ---
const DUMMY_USERS = [
    { id: 'u1', name: 'Admin User', email: 'admin@casestrack.com', role: 'Admin' },
    { id: 'u2', name: 'Alice Advocate', email: 'alice@casestrack.com', role: 'Advocate' },
    { id: 'u3', name: 'Bob Client', email: 'bob@casestrack.com', role: 'Client' },
    { id: 'u4', name: 'Charlie Legal Asst', email: 'charlie@casestrack.com', role: 'Legal Assistant' },
];

const DUMMY_CLIENTS = [
    { id: 'cl1', name: 'Global Corp', email: 'contact@globalcorp.com', phone: '123-456-7890', address: '123 Business St, City', type: 'Corporate', lastUpdate: '2023-10-20' },
    { id: 'cl2', name: 'Jane Doe', email: 'jane.doe@example.com', phone: '098-765-4321', address: '456 Oak Ave, Town', type: 'Individual', lastUpdate: '2023-11-01' },
    { id: 'cl3', name: 'Innovate Tech', email: 'info@innovatetech.com', phone: '555-111-2222', address: '789 Tech Rd, City', type: 'Corporate', lastUpdate: '2023-09-15' },
    { id: 'cl4', name: 'Mark Smith', email: 'mark.s@example.com', phone: '777-888-9999', address: '101 Pine St, Village', type: 'Individual', lastUpdate: '2023-10-25' },
    { id: 'cl5', name: 'Acme LLC', email: 'support@acme.com', phone: '111-222-3333', address: '202 Elm St, Metro', type: 'Corporate', lastUpdate: '2023-12-01' },
];

const DUMMY_DOCUMENTS = [
    { id: 'd1', case_id: 'c1', name: 'Initial Complaint', type: 'PDF', uploadedBy: 'u2', uploadDate: '2023-10-01', url: 'https://example.com/document1.pdf' },
    { id: 'd2', case_id: 'c1', name: 'Client Agreement', type: 'DOCX', uploadedBy: 'u4', uploadDate: '2023-10-05', url: 'https://example.com/document2.docx' },
    { id: 'd3', case_id: 'c2', name: 'Court Order 2023-001', type: 'PDF', uploadedBy: 'u2', uploadDate: '2023-11-10', url: 'https://example.com/document3.pdf' },
    { id: 'd4', case_id: 'c3', name: 'Witness Statement', type: 'PDF', uploadedBy: 'u4', uploadDate: '2023-09-20', url: 'https://example.com/document4.pdf' },
    { id: 'd5', case_id: 'c1', name: 'Evidence - Image', type: 'JPG', uploadedBy: 'u2', uploadDate: '2023-10-10', url: 'https://example.com/image.jpg' },
    { id: 'd6', case_id: 'c4', name: 'Contract Review', type: 'PDF', uploadedBy: 'u2', uploadDate: '2023-12-05', url: 'https://example.com/document6.pdf' },
    { id: 'd7', case_id: 'c5', name: 'Legal Notice', type: 'PDF', uploadedBy: 'u4', uploadDate: '2023-12-10', url: 'https://example.com/document7.pdf' },
];

const DUMMY_TASKS = [
    { id: 't1', case_id: 'c1', title: 'Draft Initial Pleading', status: 'InProgress', dueDate: '2023-12-15', assignedToId: 'u4', priority: 'High', description: 'Prepare initial legal document for Case #2023-001.' },
    { id: 't2', case_id: 'c1', title: 'Schedule Client Meeting', status: 'Completed', dueDate: '2023-11-05', assignedToId: 'u2', priority: 'Medium', description: 'Coordinate meeting with Global Corp representatives.' },
    { id: 't3', case_id: 'c2', title: 'Research Precedents', status: 'Pending', dueDate: '2023-12-20', assignedToId: 'u4', priority: 'High', description: 'Find relevant case law for patent infringement.' },
    { id: 't4', case_id: 'c3', title: 'Prepare Witness Brief', status: 'ActionRequired', dueDate: '2023-12-10', assignedToId: 'u2', priority: 'High', description: 'Gather information and outline questions for witness.' },
    { id: 't5', case_id: 'c1', title: 'File Document with Court', status: 'Draft', dueDate: '2023-12-12', assignedToId: 'u4', priority: 'Medium', description: 'Submit complaint documents to the court.' },
    { id: 't6', case_id: 'c4', title: 'Review Contract', status: 'InProgress', dueDate: '2024-01-05', assignedToId: 'u2', priority: 'High', description: 'Thorough review of Acme LLC service agreement.' },
    { id: 't7', case_id: 'c5', title: 'Respond to Legal Notice', status: 'Pending', dueDate: '2023-12-25', assignedToId: 'u4', priority: 'High', description: 'Draft a formal response to the legal notice received.' },
];

const DUMMY_CASES = [
    {
        id: 'c1',
        title: 'Global Corp v. Innovate Tech - Patent Infringement',
        client_id: 'cl1',
        status: 'InProgress',
        type: 'Litigation',
        priority: 'High',
        courtDate: '2024-01-20',
        lastUpdate: '2023-12-01',
        description: 'Case regarding alleged patent infringement by Innovate Tech against Global Corp.',
        assignedAdvocateId: 'u2',
        workflowHistory: [
            { stage: 'Case Initiated', date: '2023-10-01', actor: 'Admin User', notes: 'Initial case creation.', status: 'Completed', slaStatus: 'Met' },
            { stage: 'Client Interview', date: '2023-10-05', actor: 'Alice Advocate', notes: 'Interview with Global Corp legal team.', status: 'Completed', slaStatus: 'Met' },
            { stage: 'Pleading Drafted', date: '2023-11-01', actor: 'Charlie Legal Asst', notes: 'First draft of the complaint.', status: 'Completed', slaStatus: 'Met' },
            { stage: 'Pleading Reviewed & Approved', date: '2023-11-15', actor: 'Alice Advocate', notes: 'Advocate review complete, pending filing.', status: 'InProgress', slaStatus: 'Met' },
            { stage: 'Discovery Phase', date: null, actor: null, notes: null, status: 'Pending', slaStatus: 'On Track' },
            { stage: 'Court Hearing', date: null, actor: null, notes: null, status: 'Pending', slaStatus: 'On Track' },
        ],
        auditLogs: [
            { id: 'al1-c1', timestamp: '2023-10-01T10:00:00Z', actor: 'Admin User', action: 'Case Created', details: 'Case #C1 initiated.', category: 'System' },
            { id: 'al2-c1', timestamp: '2023-10-05T14:30:00Z', actor: 'Alice Advocate', action: 'Client Meeting Scheduled', details: 'Task T2 created for client meeting.', category: 'User Action' },
            { id: 'al3-c1', timestamp: '2023-11-01T11:00:00Z', actor: 'Charlie Legal Asst', action: 'Pleading Drafted', details: 'Initial Pleading (d1) uploaded.', category: 'Document Upload' },
        ]
    },
    {
        id: 'c2',
        title: 'Jane Doe - Divorce Settlement',
        client_id: 'cl2',
        status: 'Pending',
        type: 'Family Law',
        priority: 'Medium',
        courtDate: '2024-02-10',
        lastUpdate: '2023-11-20',
        description: 'Negotiation for divorce settlement for Jane Doe.',
        assignedAdvocateId: 'u2',
        workflowHistory: [
            { stage: 'Case Initiated', date: '2023-10-15', actor: 'Legal Assistant', notes: 'Initial setup completed.', status: 'Completed', slaStatus: 'Met' },
            { stage: 'Information Gathering', date: '2023-10-25', actor: 'Legal Assistant', notes: 'Gathering financial documents.', status: 'Completed', slaStatus: 'Met' },
            { stage: 'Settlement Proposal Draft', date: '2023-11-20', actor: 'Alice Advocate', notes: 'First draft of settlement terms.', status: 'ActionRequired', slaStatus: 'Warning' },
            { stage: 'Client Review', date: null, actor: null, notes: null, status: 'Pending', slaStatus: 'On Track' },
        ],
        auditLogs: [
            { id: 'al1-c2', timestamp: '2023-10-15T09:00:00Z', actor: 'Charlie Legal Asst', action: 'Case Created', details: 'Case #C2 initiated.', category: 'System' },
            { id: 'al2-c2', timestamp: '2023-11-20T16:00:00Z', actor: 'Alice Advocate', action: 'Settlement Drafted', details: 'Settlement proposal drafted for client review.', category: 'User Action' },
        ]
    },
    {
        id: 'c3',
        title: 'Innovate Tech - Contract Dispute',
        client_id: 'cl3',
        status: 'ActionRequired',
        type: 'Contract Law',
        priority: 'High',
        courtDate: '2024-01-05',
        lastUpdate: '2023-11-25',
        description: 'Dispute over breach of service contract.',
        assignedAdvocateId: 'u2',
        workflowHistory: [
            { stage: 'Case Initiated', date: '2023-09-10', actor: 'Admin User', notes: 'Contract dispute case opened.', status: 'Completed', slaStatus: 'Met' },
            { stage: 'Evidence Collection', date: '2023-09-20', actor: 'Legal Assistant', notes: 'Collected relevant contracts and emails.', status: 'Completed', slaStatus: 'Met' },
            { stage: 'Legal Analysis', date: '2023-10-10', actor: 'Alice Advocate', notes: 'Analyzing contract terms and potential breaches.', status: 'Completed', slaStatus: 'Met' },
            { stage: 'Witness Interview', date: '2023-11-01', actor: 'Alice Advocate', notes: 'Interview with key witness conducted.', status: 'InProgress', slaStatus: 'Met' },
            { stage: 'Demand Letter Issued', date: null, actor: null, notes: null, status: 'ActionRequired', slaStatus: 'Breached' }, // SLA Breach example
        ],
        auditLogs: [
            { id: 'al1-c3', timestamp: '2023-09-10T10:00:00Z', actor: 'Admin User', action: 'Case Created', details: 'Case #C3 initiated.', category: 'System' },
            { id: 'al2-c3', timestamp: '2023-11-25T09:00:00Z', actor: 'Alice Advocate', action: 'Action Required', details: 'SLA for Demand Letter Breached.', category: 'System Alert' },
        ]
    },
    {
        id: 'c4',
        title: 'Acme LLC - Mergers & Acquisitions',
        client_id: 'cl5',
        status: 'InProgress',
        type: 'Corporate Law',
        priority: 'Medium',
        courtDate: null,
        lastUpdate: '2023-12-05',
        description: 'Advising Acme LLC on potential acquisition targets.',
        assignedAdvocateId: 'u2',
        workflowHistory: [
            { stage: 'Project Kick-off', date: '2023-12-01', actor: 'Alice Advocate', notes: 'Initial meeting with Acme LLC.', status: 'Completed', slaStatus: 'Met' },
            { stage: 'Target Identification', date: '2023-12-05', actor: 'Legal Assistant', notes: 'Researching potential acquisition targets.', status: 'InProgress', slaStatus: 'On Track' },
            { stage: 'Due Diligence', date: null, actor: null, notes: null, status: 'Pending', slaStatus: 'On Track' },
        ],
        auditLogs: [
            { id: 'al1-c4', timestamp: '2023-12-01T10:00:00Z', actor: 'Alice Advocate', action: 'Case Created', details: 'Case #C4 initiated.', category: 'System' },
            { id: 'al2-c4', timestamp: '2023-12-05T14:00:00Z', actor: 'Charlie Legal Asst', action: 'Research Tasks', details: 'Assigned task T6 for contract review.', category: 'User Action' },
        ]
    },
    {
        id: 'c5',
        title: 'Mark Smith - Property Dispute',
        client_id: 'cl4',
        status: 'Pending',
        type: 'Real Estate',
        priority: 'Low',
        courtDate: '2024-03-01',
        lastUpdate: '2023-12-10',
        description: 'Dispute over land boundaries and property access.',
        assignedAdvocateId: 'u2',
        workflowHistory: [
            { stage: 'Case Initiated', date: '2023-11-28', actor: 'Legal Assistant', notes: 'Property dispute case opened.', status: 'Completed', slaStatus: 'Met' },
            { stage: 'Documentation Review', date: '2023-12-02', actor: 'Alice Advocate', notes: 'Reviewed property deeds and surveys.', status: 'Completed', slaStatus: 'Met' },
            { stage: 'Negotiation Strategy', date: '2023-12-10', actor: 'Alice Advocate', notes: 'Developing strategy for negotiation.', status: 'InProgress', slaStatus: 'On Track' },
            { stage: 'Mediation', date: null, actor: null, notes: null, status: 'Pending', slaStatus: 'On Track' },
        ],
        auditLogs: [
            { id: 'al1-c5', timestamp: '2023-11-28T09:30:00Z', actor: 'Charlie Legal Asst', action: 'Case Created', details: 'Case #C5 initiated.', category: 'System' },
            { id: 'al2-c5', timestamp: '2023-12-10T11:00:00Z', actor: 'Alice Advocate', action: 'Strategy Session', details: 'Negotiation strategy planned.', category: 'User Action' },
        ]
    },
    {
        id: 'c6',
        title: 'Global Corp - Regulatory Compliance',
        client_id: 'cl1',
        status: 'Approved',
        type: 'Regulatory',
        priority: 'Medium',
        courtDate: null,
        lastUpdate: '2023-11-15',
        description: 'Ensuring Global Corp adheres to new data privacy regulations.',
        assignedAdvocateId: 'u2',
        workflowHistory: [
            { stage: 'Project Scoping', date: '2023-10-01', actor: 'Alice Advocate', notes: 'Defined scope of compliance project.', status: 'Completed', slaStatus: 'Met' },
            { stage: 'Policy Review', date: '2023-10-20', actor: 'Charlie Legal Asst', notes: 'Reviewed existing company policies.', status: 'Completed', slaStatus: 'Met' },
            { stage: 'Implementation Plan', date: '2023-11-10', actor: 'Alice Advocate', notes: 'Developed new policy implementation plan.', status: 'Completed', slaStatus: 'Met' },
            { stage: 'Final Approval', date: '2023-11-15', actor: 'Admin User', notes: 'Compliance plan approved.', status: 'Approved', slaStatus: 'Met' },
        ],
        auditLogs: [
            { id: 'al1-c6', timestamp: '2023-10-01T10:00:00Z', actor: 'Alice Advocate', action: 'Case Created', details: 'Case #C6 initiated.', category: 'System' },
            { id: 'al2-c6', timestamp: '2023-11-15T15:00:00Z', actor: 'Admin User', action: 'Case Approved', details: 'Regulatory compliance project finalized.', category: 'User Action' },
        ]
    },
];

// Combine all data into a single source of truth for easier lookup
const DATA = {
    users: DUMMY_USERS,
    clients: DUMMY_CLIENTS,
    documents: DUMMY_DOCUMENTS,
    tasks: DUMMY_TASKS,
    cases: DUMMY_CASES,
    // Helper to get records by ID
    getCaseById: (id) => DUMMY_CASES.find(c => c.id === id),
    getClientById: (id) => DUMMY_CLIENTS.find(c => c.id === id),
    getTaskById: (id) => DUMMY_TASKS.find(t => t.id === id),
    getDocumentById: (id) => DUMMY_DOCUMENTS.find(d => d.id === id),
    getUserById: (id) => DUMMY_USERS.find(u => u.id === id),
};

// --- RBAC Configuration (STRICTLY ENFORCED) ---
const PERMISSIONS = {
    Admin: {
        screens: ['Dashboard', 'CasesList', 'ClientsList', 'CaseDetail', 'ClientDetail', 'CaseForm', 'ClientForm', 'TaskForm', 'WorkflowDetail', 'AuditLogs'],
        actions: {
            view_dashboard: true, view_all_cases: true, view_all_clients: true,
            create_case: true, edit_case: true, delete_case: true, approve_case: true,
            create_client: true, edit_client: true, delete_client: true,
            assign_task: true, edit_task: true, view_audit_logs: true,
            export_data: true, manage_users: true
        }
    },
    Advocate: {
        screens: ['Dashboard', 'CasesList', 'ClientsList', 'CaseDetail', 'ClientDetail', 'CaseForm', 'TaskForm', 'WorkflowDetail', 'AuditLogs'],
        actions: {
            view_dashboard: true, view_assigned_cases: true, view_all_clients: true,
            create_case: true, edit_case: true,
            edit_client: false, // Cannot edit client details directly
            assign_task: true, edit_task: true,
            view_audit_logs: true,
            export_data: true,
        }
    },
    'Legal Assistant': {
        screens: ['Dashboard', 'CasesList', 'ClientsList', 'CaseDetail', 'ClientDetail', 'TaskForm', 'WorkflowDetail'],
        actions: {
            view_dashboard: true, view_all_cases: true, view_all_clients: true,
            create_case: true, edit_case: false, // Can create but not edit cases
            edit_client: false,
            assign_task: true, edit_task: true,
            view_audit_logs: false, // Cannot view audit logs
            export_data: false,
        }
    },
    Client: {
        screens: ['Dashboard', 'CasesList', 'CaseDetail', 'WorkflowDetail'],
        actions: {
            view_dashboard: true, view_my_cases: true,
            create_case: false, edit_case: false,
            edit_client: false,
            assign_task: false, edit_task: false,
            view_audit_logs: false,
            export_data: false,
        }
    }
};

// Helper function to get status-based CSS class
const getStatusClass = (status) => {
    switch (status) {
        case 'Approved': case 'Completed': case 'Closed': return 'status-Approved';
        case 'InProgress': case 'Assigned': return 'status-InProgress';
        case 'Pending': case 'ActionRequired': return 'status-Pending';
        case 'Rejected': case 'SLABreach': case 'Blocked': return 'status-Rejected';
        case 'Exception': case 'Escalation': return 'status-Exception';
        case 'Draft': case 'Archived': return 'status-Draft';
        default: return 'status-Draft';
    }
};

// --- Context for Auth and Navigation ---
const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { id, name, email, role }
    const [currentScreen, setCurrentScreen] = useState('Dashboard');
    const [screenHistory, setScreenHistory] = useState([]); // Stack of { screen: 'Name', recordId: 'id' }
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('info'); // 'info', 'success', 'error'
    const [showGlobalSearch, setShowGlobalSearch] = useState(false);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({});

    // RBAC check
    const canAccess = (feature, action = null) => {
        if (!user) return false;
        const rolePermissions = PERMISSIONS[user.role];
        if (!rolePermissions) return false;

        if (feature === 'screen') {
            return rolePermissions.screens.includes(action);
        }
        if (feature === 'action') {
            return rolePermissions.actions[action];
        }
        return false;
    };

    // Navigation (FULL-SCREEN CARD NAVIGATION)
    const navigate = (screenName, recordId = null) => {
        if (!canAccess('screen', screenName)) {
            showToast(`Access Denied: You do not have permission to view ${screenName}.`, 'error');
            return;
        }
        setScreenHistory(prev => [...prev, { screen: currentScreen, recordId: selectedRecordId }]);
        setCurrentScreen(screenName);
        setSelectedRecordId(recordId);
        window.scrollTo(0, 0); // Scroll to top on navigation
    };

    const goBack = () => {
        if (screenHistory.length > 0) {
            const lastScreen = screenHistory[screenHistory.length - 1];
            setScreenHistory(prev => prev.slice(0, -1)); // React State Mutation Bug fix
            setCurrentScreen(lastScreen.screen);
            setSelectedRecordId(lastScreen.recordId);
            window.scrollTo(0, 0);
        } else {
            // If no history, navigate to dashboard as fallback
            setCurrentScreen('Dashboard');
            setSelectedRecordId(null);
        }
    };

    // Notification Toast
    const showToast = (message, type = 'info') => {
        setNotificationMessage(message);
        setNotificationType(type);
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };

    const login = (role) => {
        const selectedUser = DUMMY_USERS.find(u => u.role === role);
        if (selectedUser) {
            setUser(selectedUser);
            navigate('Dashboard');
            showToast(`Welcome, ${selectedUser.name}!`, 'info');
        }
    };

    const logout = () => {
        setUser(null);
        setCurrentScreen('Dashboard');
        setScreenHistory([]);
        setSelectedRecordId(null);
        showToast('You have been logged out.', 'info');
    };

    const applyFilters = (filters) => {
        setFilterCriteria(filters);
        showToast('Filters applied!', 'info');
        setShowFilterPanel(false);
    };

    const clearFilters = () => {
        setFilterCriteria({});
        showToast('Filters cleared!', 'info');
        setShowFilterPanel(false);
    };

    const contextValue = {
        user, login, logout, canAccess,
        currentScreen, navigate, goBack, screenHistory, selectedRecordId,
        showToast,
        showGlobalSearch, setShowGlobalSearch,
        showFilterPanel, setShowFilterPanel,
        filterCriteria, applyFilters, clearFilters
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
            {showNotification && (
                <div className={`notification-toast-container ${showNotification ? '' : 'hide'}`}>
                    <div className="notification-toast">
                        {notificationType === 'success' && <FaCheckCircle className="notification-toast-icon" style={{ color: 'var(--status-green)' }} />}
                        {notificationType === 'error' && <FaTimesCircle className="notification-toast-icon" style={{ color: 'var(--status-red)' }} />}
                        {notificationType === 'info' && <FaInfoCircle className="notification-toast-icon" style={{ color: 'var(--primary-color)' }} />}
                        <span>{notificationMessage}</span>
                    </div>
                </div>
            )}
        </AppContext.Provider>
    );
};

// --- Reusable Components ---

const Breadcrumbs = ({ path }) => {
    const { navigate, goBack, currentScreen } = useContext(AppContext);
    return (
        <div className="breadcrumbs">
            {screenHistory.length > 0 && (
                <button onClick={goBack} className="btn-icon">
                    <FaArrowLeft />
                </button>
            )}
            <span style={{ marginLeft: 'var(--spacing-xs)' }}>Home</span>
            {' / '}
            <span>{currentScreen}</span>
        </div>
    );
};

const Header = () => {
    const { user, logout, navigate, canAccess, setShowGlobalSearch, setShowFilterPanel } = useContext(AppContext);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    return (
        <header className="header">
            <div className="header-left">
                {screenHistory.length > 0 && (
                    <button onClick={goBack} className="btn-icon" style={{ color: 'var(--text-white)' }}>
                        <FaArrowLeft />
                    </button>
                )}
                <h1 className="header-title">CaseTrack</h1>
                <nav className="header-nav">
                    {canAccess('screen', 'Dashboard') && <a onClick={() => navigate('Dashboard')}>Dashboard</a>}
                    {canAccess('screen', 'CasesList') && <a onClick={() => navigate('CasesList')}>Cases</a>}
                    {canAccess('screen', 'ClientsList') && <a onClick={() => navigate('ClientsList')}>Clients</a>}
                    {canAccess('screen', 'TasksList') && <a onClick={() => navigate('TasksList')}>Tasks</a>}
                </nav>
            </div>
            <div className="header-right">
                <button className="btn-icon" onClick={() => setShowGlobalSearch(true)} style={{ color: 'var(--text-white)' }}>
                    <FaSearch />
                </button>
                <button className="btn-icon" style={{ color: 'var(--text-white)' }}>
                    <FaBell />
                </button>
                <div className="user-profile" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                    <div className="user-avatar">{user?.name.charAt(0).toUpperCase()}</div>
                    <span>{user?.name} ({user?.role})</span>
                    {showUserDropdown && (
                        <div className="user-dropdown">
                            <button onClick={logout}>
                                <FaSignOutAlt style={{ marginRight: 'var(--spacing-xs)' }} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const GlobalSearchModal = () => {
    const { showGlobalSearch, setShowGlobalSearch, navigate } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({ cases: [], clients: [], tasks: [], documents: [] });

    useEffect(() => {
        if (searchTerm.length < 2) {
            setSearchResults({ cases: [], clients: [], tasks: [], documents: [] });
            return;
        }

        const lowerCaseSearch = searchTerm.toLowerCase();
        const filteredCases = DATA.cases.filter(c =>
            c.title.toLowerCase().includes(lowerCaseSearch) ||
            c.description.toLowerCase().includes(lowerCaseSearch) ||
            DATA.clients.find(cl => cl.id === c.client_id)?.name.toLowerCase().includes(lowerCaseSearch)
        ).slice(0, 3); // Limit results for brevity

        const filteredClients = DATA.clients.filter(cl =>
            cl.name.toLowerCase().includes(lowerCaseSearch) ||
            cl.email.toLowerCase().includes(lowerCaseSearch)
        ).slice(0, 3);

        const filteredTasks = DATA.tasks.filter(t =>
            t.title.toLowerCase().includes(lowerCaseSearch) ||
            t.description.toLowerCase().includes(lowerCaseSearch)
        ).slice(0, 3);

        const filteredDocuments = DATA.documents.filter(d =>
            d.name.toLowerCase().includes(lowerCaseSearch)
        ).slice(0, 3);

        setSearchResults({
            cases: filteredCases,
            clients: filteredClients,
            tasks: filteredTasks,
            documents: filteredDocuments
        });
    }, [searchTerm]);

    const handleResultClick = (screen, id) => {
        navigate(screen, id);
        setShowGlobalSearch(false);
        setSearchTerm('');
    };

    if (!showGlobalSearch) return null;

    return (
        <div className="modal-overlay global-search-modal" onClick={() => setShowGlobalSearch(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={() => setShowGlobalSearch(false)}>
                    &times;
                </button>
                <div className="global-search-input-container">
                    <FaSearch className="global-search-input-icon" />
                    <input
                        type="text"
                        placeholder="Search cases, clients, documents, tasks..."
                        className="global-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>
                {searchTerm.length >= 2 && (
                    <div className="global-search-results">
                        {searchResults.cases.length > 0 && (
                            <>
                                <h4>Cases</h4>
                                {searchResults.cases.map(item => (
                                    <div key={item.id} className="global-search-item" onClick={() => handleResultClick('CaseDetail', item.id)}>
                                        <FaGavel className="global-search-item-icon" />
                                        <div className="global-search-item-info">
                                            <strong>{item.title}</strong>
                                            <span>Case ID: {item.id} | Status: {item.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                        {searchResults.clients.length > 0 && (
                            <>
                                <h4>Clients</h4>
                                {searchResults.clients.map(item => (
                                    <div key={item.id} className="global-search-item" onClick={() => handleResultClick('ClientDetail', item.id)}>
                                        <FaUsers className="global-search-item-icon" />
                                        <div className="global-search-item-info">
                                            <strong>{item.name}</strong>
                                            <span>Client ID: {item.id} | Email: {item.email}</span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                        {searchResults.tasks.length > 0 && (
                            <>
                                <h4>Tasks</h4>
                                {searchResults.tasks.map(item => (
                                    <div key={item.id} className="global-search-item" onClick={() => handleResultClick('TaskDetail', item.id)}>
                                        <FaTasks className="global-search-item-icon" />
                                        <div className="global-search-item-info">
                                            <strong>{item.title}</strong>
                                            <span>Task ID: {item.id} | Due: {item.dueDate} | Status: {item.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                        {searchResults.documents.length > 0 && (
                            <>
                                <h4>Documents</h4>
                                {searchResults.documents.map(item => (
                                    <div key={item.id} className="global-search-item" onClick={() => handleResultClick('DocumentDetail', item.id)}>
                                        <FaFileAlt className="global-search-item-icon" />
                                        <div className="global-search-item-info">
                                            <strong>{item.name}</strong>
                                            <span>Type: {item.type} | Case: {item.case_id}</span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                        {searchResults.cases.length === 0 && searchResults.clients.length === 0 && searchResults.tasks.length === 0 && searchResults.documents.length === 0 && searchTerm.length >= 2 && (
                            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: 'var(--spacing-lg)' }}>No results found for "{searchTerm}".</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const FilterPanel = () => {
    const { showFilterPanel, setShowFilterPanel, applyFilters, clearFilters, filterCriteria } = useContext(AppContext);
    const [localFilters, setLocalFilters] = useState(filterCriteria);

    useEffect(() => {
        setLocalFilters(filterCriteria);
    }, [filterCriteria]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    if (!showFilterPanel) return null;

    return (
        <div className={`filter-panel ${showFilterPanel ? 'open' : ''}`}>
            <div className="filter-panel-header">
                <h3>Filters</h3>
                <button className="btn-icon" onClick={() => setShowFilterPanel(false)}>&times;</button>
            </div>
            <div className="filter-panel-content">
                <div className="filter-group">
                    <label htmlFor="statusFilter">Status</label>
                    <select id="statusFilter" name="status" value={localFilters.status || ''} onChange={handleChange}>
                        <option value="">All Statuses</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Pending">Pending</option>
                        <option value="ActionRequired">Action Required</option>
                        <option value="Completed">Completed</option>
                        <option value="SLABreach">SLA Breach</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="typeFilter">Case Type</label>
                    <select id="typeFilter" name="type" value={localFilters.type || ''} onChange={handleChange}>
                        <option value="">All Types</option>
                        <option value="Litigation">Litigation</option>
                        <option value="Family Law">Family Law</option>
                        <option value="Contract Law">Contract Law</option>
                        <option value="Corporate Law">Corporate Law</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Regulatory">Regulatory</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="priorityFilter">Priority</label>
                    <select id="priorityFilter" name="priority" value={localFilters.priority || ''} onChange={handleChange}>
                        <option value="">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="clientFilter">Client Name</label>
                    <input type="text" id="clientFilter" name="clientName" placeholder="Search client name..." value={localFilters.clientName || ''} onChange={handleChange} />
                </div>
            </div>
            <div className="filter-actions">
                <button className="btn btn-primary" onClick={() => applyFilters(localFilters)}>Apply Filters</button>
                <button className="btn btn-secondary" onClick={clearFilters}>Clear All</button>
            </div>
        </div>
    );
};


const CaseCard = ({ caseItem }) => {
    const { navigate } = useContext(AppContext);
    const client = DATA.getClientById(caseItem.client_id);
    const advocate = DATA.getUserById(caseItem.assignedAdvocateId);

    return (
        <div className={`card ${getStatusClass(caseItem.status)}`} onClick={() => navigate('CaseDetail', caseItem.id)}>
            <div className="card-header" style={{ backgroundColor: `var(--status-${getStatusClass(caseItem.status).split('-')[1]})` }}>
                <span>{caseItem.type}</span>
                <span className="card-status-badge" style={{ backgroundColor: 'transparent', position: 'static' }}>{caseItem.status}</span>
            </div>
            <div className="card-body">
                <h4 className="card-title">{caseItem.title}</h4>
                <p className="card-meta">Client: {client?.name || 'N/A'}</p>
                <p className="card-meta">Advocate: {advocate?.name || 'N/A'}</p>
                {caseItem.courtDate && <p className="card-meta">Court Date: {caseItem.courtDate}</p>}
            </div>
            <div className="card-footer">
                <span>Priority: {caseItem.priority}</span>
                <span>Last Update: {caseItem.lastUpdate}</span>
            </div>
        </div>
    );
};

const ClientCard = ({ clientItem }) => {
    const { navigate } = useContext(AppContext);
    return (
        <div className="card" onClick={() => navigate('ClientDetail', clientItem.id)}>
            <div className="card-header" style={{ backgroundColor: 'var(--primary-color)' }}>
                <span>{clientItem.type}</span>
            </div>
            <div className="card-body">
                <h4 className="card-title">{clientItem.name}</h4>
                <p className="card-meta">Email: {clientItem.email}</p>
                <p className="card-meta">Phone: {clientItem.phone}</p>
            </div>
            <div className="card-footer">
                <span>ID: {clientItem.id}</span>
                <span>Last Update: {clientItem.lastUpdate}</span>
            </div>
        </div>
    );
};

const TaskCard = ({ taskItem }) => {
    const { navigate } = useContext(AppContext);
    const assignedTo = DATA.getUserById(taskItem.assignedToId);
    const caseItem = DATA.getCaseById(taskItem.case_id);

    return (
        <div className={`card ${getStatusClass(taskItem.status)}`} onClick={() => navigate('TaskDetail', taskItem.id)}>
            <div className="card-header" style={{ backgroundColor: `var(--status-${getStatusClass(taskItem.status).split('-')[1]})` }}>
                <span>{taskItem.priority} Priority</span>
                <span className="card-status-badge" style={{ backgroundColor: 'transparent', position: 'static' }}>{taskItem.status}</span>
            </div>
            <div className="card-body">
                <h4 className="card-title">{taskItem.title}</h4>
                <p className="card-meta">Case: {caseItem?.title || 'N/A'}</p>
                <p className="card-meta">Assigned To: {assignedTo?.name || 'N/A'}</p>
            </div>
            <div className="card-footer">
                <span>Due: {taskItem.dueDate}</span>
            </div>
        </div>
    );
};

const DocumentCard = ({ docItem }) => {
    const { navigate } = useContext(AppContext);
    const uploadedBy = DATA.getUserById(docItem.uploadedBy);

    return (
        <div className="document-item" onClick={() => alert(`Simulating document preview for ${docItem.name}`)}>
            <FaFileAlt className="document-item-icon" />
            <div className="document-item-info">
                <span className="document-item-name">{docItem.name}</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-light)' }}>{docItem.type} by {uploadedBy?.name}</span>
            </div>
        </div>
    );
};

// --- Screen Components ---

const AuthScreen = () => {
    const { login } = useContext(AppContext);
    return (
        <div className="auth-container">
            <div className="login-card">
                <h2>Welcome to CaseTrack</h2>
                <p>Please select your role to log in:</p>
                <div className="role-selection-grid">
                    {DUMMY_USERS.map(user => (
                        <button key={user.id} className="role-button" onClick={() => login(user.role)}>
                            {user.role === 'Admin' && <FaUserShield className="role-icon" />}
                            {user.role === 'Advocate' && <FaGavel className="role-icon" />}
                            {user.role === 'Client' && <FaUsers className="role-icon" />}
                            {user.role === 'Legal Assistant' && <FaClipboardList className="role-icon" />}
                            <span className="role-name">{user.role}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { user, canAccess, navigate } = useContext(AppContext);
    // Filter cases based on role
    const casesForUser = user?.role === 'Client'
        ? DATA.cases.filter(c => DATA.getClientById(c.client_id)?.email === user.email)
        : DATA.cases; // Admins, Advocates, Legal Assistants see all or assigned (simplified to all for now)

    const pendingCases = casesForUser.filter(c => c.status === 'Pending' || c.status === 'ActionRequired');
    const inProgressCases = casesForUser.filter(c => c.status === 'InProgress' || c.status === 'Assigned');
    const openTasks = DATA.tasks.filter(t => t.status !== 'Completed' && t.assignedToId === user?.id);

    return (
        <div className="page-container">
            <Breadcrumbs />
            <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Hello, {user?.name}! Your Dashboard</h1>

            {canAccess('action', 'view_dashboard') && (
                <>
                    <h2 className="dashboard-section-title">Key Performance Indicators</h2>
                    <div className="kpi-grid">
                        <div className="kpi-card" onClick={() => navigate('CasesList')}>
                            <FaGavel className="kpi-card-icon" />
                            <div className="kpi-card-value">{casesForUser.length}</div>
                            <div className="kpi-card-label">Total Cases</div>
                        </div>
                        <div className="kpi-card" onClick={() => navigate('CasesList', null, { status: 'Pending' })}>
                            <FaHourglassHalf className="kpi-card-icon" style={{ color: 'var(--status-orange)' }} />
                            <div className="kpi-card-value" style={{ color: 'var(--status-orange)' }}>{pendingCases.length}</div>
                            <div className="kpi-card-label">Pending Cases</div>
                        </div>
                        <div className="kpi-card" onClick={() => navigate('CasesList', null, { status: 'InProgress' })}>
                            <FaRegClock className="kpi-card-icon" style={{ color: 'var(--status-blue)' }} />
                            <div className="kpi-card-value" style={{ color: 'var(--status-blue)' }}>{inProgressCases.length}</div>
                            <div className="kpi-card-label">In Progress</div>
                        </div>
                        {canAccess('action', 'assign_task') && (
                             <div className="kpi-card" onClick={() => navigate('TasksList')}>
                                <FaTasks className="kpi-card-icon" style={{ color: 'var(--accent-color)' }} />
                                <div className="kpi-card-value" style={{ color: 'var(--accent-color)' }}>{openTasks.length}</div>
                                <div className="kpi-card-label">Open Tasks</div>
                            </div>
                        )}
                    </div>

                    <h2 className="dashboard-section-title">Recent Activities & Alerts</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
                        <div className="chart-container">
                            <FaChartBar style={{ marginRight: 'var(--spacing-md)' }}/> Sample Bar Chart: Case Status Distribution (Real-time updates)
                        </div>
                        <div className="chart-container">
                            <FaChartLine style={{ marginRight: 'var(--spacing-md)' }}/> Sample Line Chart: Historical Case Volume
                        </div>
                    </div>

                    {canAccess('action', 'view_assigned_cases') && (
                        <>
                            <h2 className="dashboard-section-title" style={{ marginTop: 'var(--spacing-xl)' }}>My Assigned Cases</h2>
                            <div className="card-grid">
                                {casesForUser.length > 0 ? (
                                    casesForUser.slice(0, 4).map(c => <CaseCard key={c.id} caseItem={c} />)
                                ) : (
                                    <p>No assigned cases for you. <button className="btn btn-link" onClick={() => navigate('CasesList')}>View all cases</button></p>
                                )}
                            </div>
                        </>
                    )}

                    {canAccess('action', 'view_my_cases') && user?.role === 'Client' && (
                        <>
                            <h2 className="dashboard-section-title" style={{ marginTop: 'var(--spacing-xl)' }}>My Cases</h2>
                            <div className="card-grid">
                                {casesForUser.length > 0 ? (
                                    casesForUser.map(c => <CaseCard key={c.id} caseItem={c} />)
                                ) : (
                                    <p>You currently have no active cases.</p>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

const CasesListScreen = () => {
    const { user, navigate, canAccess, showToast, setShowFilterPanel, filterCriteria } = useContext(AppContext);

    const allCases = DATA.cases;
    let filteredCases = allCases;

    // Apply filters
    if (filterCriteria.status) {
        filteredCases = filteredCases.filter(c => c.status === filterCriteria.status);
    }
    if (filterCriteria.type) {
        filteredCases = filteredCases.filter(c => c.type === filterCriteria.type);
    }
    if (filterCriteria.priority) {
        filteredCases = filteredCases.filter(c => c.priority === filterCriteria.priority);
    }
    if (filterCriteria.clientName) {
        filteredCases = filteredCases.filter(c =>
            DATA.getClientById(c.client_id)?.name.toLowerCase().includes(filterCriteria.clientName.toLowerCase())
        );
    }

    // RBAC: Client can only see their cases
    if (user?.role === 'Client') {
        filteredCases = filteredCases.filter(c => DATA.getClientById(c.client_id)?.email === user.email);
    }

    // Sorting (example: by last update descending)
    filteredCases.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));

    const handleCreateNewCase = () => {
        if (canAccess('action', 'create_case')) {
            navigate('CaseForm');
        } else {
            showToast('Access Denied: You cannot create new cases.', 'error');
        }
    };

    return (
        <div className="page-container">
            <Breadcrumbs />
            <div className="page-header">
                <h1 style={{ margin: '0' }}>Cases Overview</h1>
                <div className="page-header-actions">
                    <button className="btn btn-outline" onClick={() => setShowFilterPanel(true)}>
                        <FaFilter style={{ marginRight: 'var(--spacing-xs)' }} /> Filters
                    </button>
                    {canAccess('action', 'create_case') && (
                        <button className="btn btn-primary" onClick={handleCreateNewCase}>
                            <FaPlus style={{ marginRight: 'var(--spacing-xs)' }} /> New Case
                        </button>
                    )}
                </div>
            </div>
            <div className="card-grid">
                {filteredCases.length > 0 ? (
                    filteredCases.map(caseItem => <CaseCard key={caseItem.id} caseItem={caseItem} />)
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <MdOutlineDescription style={{ fontSize: 'var(--font-size-h1)', color: 'var(--text-light)', marginBottom: 'var(--spacing-md)' }} />
                        <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-light)' }}>No cases found matching your criteria.</p>
                        {canAccess('action', 'create_case') && (
                            <button className="btn btn-primary" onClick={handleCreateNewCase}>Create First Case</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const ClientsListScreen = () => {
    const { canAccess, navigate, showToast } = useContext(AppContext);
    const clients = DATA.clients; // All clients for now, could be role-restricted later

    const handleCreateNewClient = () => {
        if (canAccess('action', 'create_client')) {
            navigate('ClientForm');
        } else {
            showToast('Access Denied: You cannot create new clients.', 'error');
        }
    };

    if (!canAccess('screen', 'ClientsList')) {
        return (
            <div className="page-container">
                <Breadcrumbs />
                <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Clients</h1>
                <p style={{ textAlign: 'center', color: 'var(--status-red)', marginTop: 'var(--spacing-xl)' }}>Access Denied: You do not have permission to view clients.</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <Breadcrumbs />
            <div className="page-header">
                <h1 style={{ margin: '0' }}>Clients Overview</h1>
                <div className="page-header-actions">
                    {canAccess('action', 'create_client') && (
                        <button className="btn btn-primary" onClick={handleCreateNewClient}>
                            <FaPlus style={{ marginRight: 'var(--spacing-xs)' }} /> New Client
                        </button>
                    )}
                </div>
            </div>
            <div className="card-grid">
                {clients.length > 0 ? (
                    clients.map(clientItem => <ClientCard key={clientItem.id} clientItem={clientItem} />)
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <FaUsers style={{ fontSize: 'var(--font-size-h1)', color: 'var(--text-light)', marginBottom: 'var(--spacing-md)' }} />
                        <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-light)' }}>No clients found.</p>
                        {canAccess('action', 'create_client') && (
                            <button className="btn btn-primary" onClick={handleCreateNewClient}>Add First Client</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const TaskDetailScreen = () => {
    const { selectedRecordId, canAccess, goBack, showToast } = useContext(AppContext);
    const task = DATA.getTaskById(selectedRecordId);
    const assignedTo = task ? DATA.getUserById(task.assignedToId) : null;
    const caseItem = task ? DATA.getCaseById(task.case_id) : null;

    if (!task) {
        return (
            <div className="page-container">
                <Breadcrumbs />
                <h1>Task Not Found</h1>
                <p>The task you are looking for does not exist.</p>
            </div>
        );
    }

    const handleEditTask = () => {
        if (canAccess('action', 'edit_task')) {
            showToast('Simulating task edit form for ' + task.title, 'info');
            // In a real app, this would navigate to a TaskForm
        } else {
            showToast('Access Denied: You cannot edit tasks.', 'error');
        }
    };

    const handleDeleteTask = () => {
        if (canAccess('action', 'delete_task')) {
            showToast('Simulating task deletion for ' + task.title, 'info');
            // In a real app, this would trigger a deletion and navigate back
        } else {
            showToast('Access Denied: You cannot delete tasks.', 'error');
        }
    };

    return (
        <div className="page-container">
            <Breadcrumbs />
            <div className="page-header">
                <h1 style={{ margin: '0' }}>Task: {task.title}</h1>
                <div className="page-header-actions">
                    {canAccess('action', 'edit_task') && (
                        <button className="btn btn-outline" onClick={handleEditTask}>
                            <FaEdit style={{ marginRight: 'var(--spacing-xs)' }} /> Edit Task
                        </button>
                    )}
                    {canAccess('action', 'delete_task') && ( // Assuming 'delete_task' permission
                        <button className="btn btn-danger" onClick={handleDeleteTask}>
                            <FaTrash style={{ marginRight: 'var(--spacing-xs)' }} /> Delete Task
                        </button>
                    )}
                </div>
            </div>

            <div className="detail-page-content">
                <div className="detail-section">
                    <h3 className="detail-section-title">Task Details</h3>
                    <div className="detail-info-grid">
                        <div className="info-item">
                            <div className="info-item-label">Status</div>
                            <div className="info-item-value">{task.status}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-item-label">Priority</div>
                            <div className="info-item-value">{task.priority}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-item-label">Due Date</div>
                            <div className="info-item-value">{task.dueDate}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-item-label">Assigned To</div>
                            <div className="info-item-value">{assignedTo?.name || 'N/A'}</div>
                        </div>
                        <div className="info-item" style={{ gridColumn: 'span 2' }}>
                            <div className="info-item-label">Related Case</div>
                            <div className="info-item-value">{caseItem?.title || 'N/A'} (ID: {task.case_id})</div>
                        </div>
                        <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                            <div className="info-item-label">Description</div>
                            <div className="info-item-value">{task.description || 'No description provided.'}</div>
                        </div>
                    </div>
                </div>
                {/* Additional sections like comments, activity log can be added */}
            </div>
        </div>
    );
};


const CaseDetailScreen = () => {
    const { user, selectedRecordId, canAccess, navigate, showToast } = useContext(AppContext);
    const caseItem = DATA.getCaseById(selectedRecordId);

    // RBAC: Client can only view cases they are associated with
    if (user?.role === 'Client' && caseItem && DATA.getClientById(caseItem.client_id)?.email !== user.email) {
        return (
            <div className="page-container">
                <Breadcrumbs />
                <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Case Detail</h1>
                <p style={{ textAlign: 'center', color: 'var(--status-red)', marginTop: 'var(--spacing-xl)' }}>Access Denied: You do not have permission to view this case.</p>
            </div>
        );
    }

    if (!caseItem) {
        return (
            <div className="page-container">
                <Breadcrumbs />
                <h1>Case Not Found</h1>
                <p>The case you are looking for does not exist.</p>
            </div>
        );
    }

    const client = DATA.getClientById(caseItem.client_id);
    const advocate = DATA.getUserById(caseItem.assignedAdvocateId);
    const relatedTasks = DATA.tasks.filter(t => t.case_id === caseItem.id);
    const relatedDocuments = DATA.documents.filter(d => d.case_id === caseItem.id);
    const auditLogs = caseItem.auditLogs;

    const handleEditCase = () => {
        if (canAccess('action', 'edit_case')) {
            navigate('CaseForm', caseItem.id);
        } else {
            showToast('Access Denied: You cannot edit this case.', 'error');
        }
    };

    const handleAddTask = () => {
        if (canAccess('action', 'assign_task')) {
            showToast('Simulating task creation form for ' + caseItem.title, 'info');
            // In a real app, this would navigate to a TaskForm with case pre-filled
        } else {
            showToast('Access Denied: You cannot add tasks.', 'error');
        }
    };

    return (
        <div className="page-container">
            <Breadcrumbs />
            <div className="page-header">
                <h1 style={{ margin: '0' }}>Case: {caseItem.title}</h1>
                <div className="page-header-actions">
                    {canAccess('action', 'edit_case') && (
                        <button className="btn btn-outline" onClick={handleEditCase}>
                            <FaEdit style={{ marginRight: 'var(--spacing-xs)' }} /> Edit Case
                        </button>
                    )}
                    {canAccess('action', 'export_data') && (
                        <button className="btn btn-secondary" onClick={() => showToast('Exporting case data to PDF...', 'info')}>
                            <FaDownload style={{ marginRight: 'var(--spacing-xs)' }} /> Export PDF
                        </button>
                    )}
                </div>
            </div>

            <div className="detail-page-content">
                <div className="detail-section">
                    <h3 className="detail-section-title">Case Overview</h3>
                    <div className="detail-info-grid">
                        <div className="info-item">
                            <div className="info-item-label">Status</div>
                            <div className="info-item-value">{caseItem.status}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-item-label">Type</div>
                            <div className="info-item-value">{caseItem.type}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-item-label">Priority</div>
                            <div className="info-item-value">{caseItem.priority}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-item-label">Client</div>
                            <div className="info-item-value">{client?.name || 'N/A'}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-item-label">Assigned Advocate</div>
                            <div className="info-item-value">{advocate?.name || 'N/A'}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-item-label">Court Date</div>
                            <div className="info-item-value">{caseItem.courtDate || 'N/A'}</div>
                        </div>
                        <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                            <div className="info-item-label">Description</div>
                            <div className="info-item-value">{caseItem.description}</div>
                        </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h3 className="detail-section-title">
                        Workflow Progress
                        {canAccess('action', 'approve_case') && ( // Example workflow action
                            <button className="btn btn-primary" onClick={() => showToast('Simulating approval action...', 'info')}>
                                <FaCheckCircle style={{ marginRight: 'var(--spacing-xs)' }} /> Approve Stage
                            </button>
                        )}
                    </h3>
                    <WorkflowProgressView workflowHistory={caseItem.workflowHistory} currentStatus={caseItem.status} />
                </div>

                <div className="detail-section">
                    <h3 className="detail-section-title">
                        Related Tasks
                        {canAccess('action', 'assign_task') && (
                            <button className="btn btn-outline" onClick={handleAddTask}>
                                <FaPlus style={{ marginRight: 'var(--spacing-xs)' }} /> Add Task
                            </button>
                        )}
                    </h3>
                    <div className="card-grid">
                        {relatedTasks.length > 0 ? (
                            relatedTasks.map(task => <TaskCard key={task.id} taskItem={task} />)
                        ) : (
                            <p style={{ gridColumn: '1 / -1', color: 'var(--text-light)' }}>No tasks assigned to this case.</p>
                        )}
                    </div>
                </div>

                <div className="detail-section">
                    <h3 className="detail-section-title">
                        Documents
                        {canAccess('action', 'upload_document') && ( // Assuming 'upload_document' permission
                            <button className="btn btn-outline" onClick={() => showToast('Simulating document upload form...', 'info')}>
                                <FaFileUpload style={{ marginRight: 'var(--spacing-xs)' }} /> Upload Document
                            </button>
                        )}
                    </h3>
                    <div className="document-list">
                        {relatedDocuments.length > 0 ? (
                            relatedDocuments.map(doc => <DocumentCard key={doc.id} docItem={doc} />)
                        ) : (
                            <p style={{ gridColumn: '1 / -1', color: 'var(--text-light)' }}>No documents for this case.</p>
                        )}
                    </div>
                </div>

                {canAccess('action', 'view_audit_logs') && (
                    <div className="detail-section">
                        <h3 className="detail-section-title">Audit Log (Immutable)</h3>
                        <AuditLogView logs={auditLogs} />
                    </div>
                )}
            </div>
        </div>
    );
};

const ClientDetailScreen = () => {
    const { selectedRecordId, canAccess, showToast, navigate } = useContext(AppContext);
    const client = DATA.getClientById(selectedRecordId);
    const relatedCases = DATA.cases.filter(c => c.client_id === selectedRecordId);

    if (!client) {
        return (
            <div className="page-container">
                <Breadcrumbs />
                <h1>Client Not Found</h1>
                <p>The client you are looking for does not exist.</p>
            </div>
        );
    }

    const handleEditClient = () => {
        if (canAccess('action', 'edit_client')) {
            navigate('ClientForm', client.id);
        } else {
            showToast('Access Denied: You cannot edit this client.', 'error');
        }
    };

    return (
        <div className="page-container">
            <Breadcrumbs />
            <div className="page-header">
                <h1 style={{ margin: '0' }}>Client: {client.name}</h1>
                <div className="page-header-actions">
                    {canAccess('action', 'edit_client') && (
                        <button className="btn btn-outline" onClick={handleEditClient}>
                            <FaEdit style={{ marginRight: 'var(--spacing-xs)' }} /> Edit Client
                        </button>
                    )}
                </div>
            </div>

            <div className="detail-page-content">
                <div className="detail-section">
                    <h3 className="detail-section-title">Client Information</h3>
                    <div className="detail-info-grid">
                        <div className="info-item">
                            <div className="info-item-label">Name</div>
                            <div className="info-item-value">{client.name}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-item-label">Type</div>
                            <div className="info-item-value">{client.type}</div>
                        </div>
                        <div className="info-item" style={{ gridColumn: 'span 2' }}>
                            <div className="info-item-label">Email</div>
                            <div className="info-item-value">{client.email}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-item-label">Phone</div>
                            <div className="info-item-value">{client.phone}</div>
                        </div>
                        <div className="info-item" style={{ gridColumn: 'span 3' }}>
                            <div className="info-item-label">Address</div>
                            <div className="info-item-value">{client.address}</div>
                        </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h3 className="detail-section-title">Related Cases ({relatedCases.length})</h3>
                    <div className="related-records-grid">
                        {relatedCases.length > 0 ? (
                            relatedCases.map(caseItem => <CaseCard key={caseItem.id} caseItem={caseItem} />)
                        ) : (
                            <p style={{ gridColumn: '1 / -1', color: 'var(--text-light)' }}>No cases associated with this client.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CaseForm = () => {
    const { selectedRecordId, goBack, showToast, canAccess } = useContext(AppContext);
    const isEditMode = !!selectedRecordId;
    const existingCase = isEditMode ? DATA.getCaseById(selectedRecordId) : null;

    const [formData, setFormData] = useState({
        title: existingCase?.title || '',
        client_id: existingCase?.client_id || '',
        status: existingCase?.status || 'Draft',
        type: existingCase?.type || '',
        priority: existingCase?.priority || 'Medium',
        courtDate: existingCase?.courtDate || '',
        description: existingCase?.description || '',
        assignedAdvocateId: existingCase?.assignedAdvocateId || '',
        documents: [] // For new documents
    });
    const [errors, setErrors] = useState({});

    // RBAC for form access
    useEffect(() => {
        if (isEditMode && !canAccess('action', 'edit_case')) {
            showToast('Access Denied: You cannot edit cases.', 'error');
            goBack();
        } else if (!isEditMode && !canAccess('action', 'create_case')) {
            showToast('Access Denied: You cannot create cases.', 'error');
            goBack();
        }
    }, [isEditMode, canAccess, showToast, goBack]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, documents: [...prev.documents, ...e.target.files] }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Case Title is mandatory.';
        if (!formData.client_id) newErrors.client_id = 'Client is mandatory.';
        if (!formData.type.trim()) newErrors.type = 'Case Type is mandatory.';
        if (!formData.description.trim()) newErrors.description = 'Description is mandatory.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showToast('Please correct the form errors.', 'error');
            return;
        }

        // Simulate API call
        const updatedCases = DATA.cases;
        if (isEditMode) {
            const index = updatedCases.findIndex(c => c.id === selectedRecordId);
            if (index !== -1) {
                updatedCases[index] = { ...updatedCases[index], ...formData, lastUpdate: new Date().toISOString().split('T')[0] };
                showToast('Case updated successfully!', 'success');
            }
        } else {
            const newCase = {
                id: `c${DATA.cases.length + 1}`,
                ...formData,
                lastUpdate: new Date().toISOString().split('T')[0],
                workflowHistory: [{ stage: 'Case Initiated', date: new Date().toISOString().split('T')[0], actor: 'System', notes: 'Initial case creation.', status: 'Completed', slaStatus: 'Met' }],
                auditLogs: [{ id: `al1-c${DATA.cases.length + 1}`, timestamp: new Date().toISOString(), actor: 'System', action: 'Case Created', details: 'New case initiated.', category: 'System' }]
            };
            updatedCases.push(newCase);
            showToast('Case created successfully!', 'success');
        }
        goBack(); // Navigate back to CaseDetail or CasesList
    };

    const availableClients = DATA.clients;
    const availableAdvocates = DATA.users.filter(u => u.role === 'Advocate');

    if (isEditMode && !existingCase) {
        return (
            <div className="page-container">
                <Breadcrumbs />
                <h1>Case Not Found</h1>
                <p>Cannot find the case to edit.</p>
                <button className="btn btn-secondary" onClick={goBack}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="page-container">
            <Breadcrumbs />
            <div className="page-header">
                <h1 style={{ margin: '0' }}>{isEditMode ? `Edit Case: ${existingCase?.title}` : 'Create New Case'}</h1>
            </div>

            <div className="detail-page-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Case Title (Mandatory)</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
                        {errors.title && <p className="form-error">{errors.title}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="client_id">Client (Mandatory)</label>
                        <select id="client_id" name="client_id" value={formData.client_id} onChange={handleChange} required>
                            <option value="">Select a Client</option>
                            {availableClients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                        {errors.client_id && <p className="form-error">{errors.client_id}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description (Mandatory)</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" required></textarea>
                        {errors.description && <p className="form-error">{errors.description}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Case Type (Mandatory)</label>
                        <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} required />
                        {errors.type && <p className="form-error">{errors.type}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status (Auto-populated for new, editable for Admin)</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={!canAccess('action', 'approve_case') && isEditMode} // Only Admin can change status post-creation (for this example)
                        >
                            <option value="Draft">Draft</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Pending">Pending</option>
                            <option value="ActionRequired">Action Required</option>
                            <option value="Completed">Completed</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="assignedAdvocateId">Assigned Advocate</label>
                        <select id="assignedAdvocateId" name="assignedAdvocateId" value={formData.assignedAdvocateId} onChange={handleChange}>
                            <option value="">Select an Advocate</option>
                            {availableAdvocates.map(advocate => (
                                <option key={advocate.id} value={advocate.id}>{advocate.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="courtDate">Next Court Date</label>
                        <input type="date" id="courtDate" name="courtDate" value={formData.courtDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="documents">Upload Documents (Optional)</label>
                        <div className="file-upload-container" onClick={() => document.getElementById('documentUpload').click()}>
                            <FaFileUpload style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-light)', marginBottom: 'var(--spacing-xs)' }} />
                            <p>Drag & drop files here or click to browse</p>
                            <input type="file" id="documentUpload" multiple onChange={handleFileChange} />
                        </div>
                        {formData.documents.length > 0 && (
                            <div style={{ marginTop: 'var(--spacing-sm)' }}>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-light)' }}>Selected files:</p>
                                <ul>
                                    {formData.documents.map((file, index) => (
                                        <li key={index} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-color)' }}>{file.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">{isEditMode ? 'Save Changes' : 'Create Case'}</button>
                        <button type="button" className="btn btn-secondary" onClick={goBack}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ClientForm = () => {
    const { selectedRecordId, goBack, showToast, canAccess } = useContext(AppContext);
    const isEditMode = !!selectedRecordId;
    const existingClient = isEditMode ? DATA.getClientById(selectedRecordId) : null;

    const [formData, setFormData] = useState({
        name: existingClient?.name || '',
        email: existingClient?.email || '',
        phone: existingClient?.phone || '',
        address: existingClient?.address || '',
        type: existingClient?.type || 'Individual',
    });
    const [errors, setErrors] = useState({});

    // RBAC for form access
    useEffect(() => {
        if (isEditMode && !canAccess('action', 'edit_client')) {
            showToast('Access Denied: You cannot edit clients.', 'error');
            goBack();
        } else if (!isEditMode && !canAccess('action', 'create_client')) {
            showToast('Access Denied: You cannot create clients.', 'error');
            goBack();
        }
    }, [isEditMode, canAccess, showToast, goBack]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Client Name is mandatory.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is mandatory.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showToast('Please correct the form errors.', 'error');
            return;
        }

        // Simulate API call
        const updatedClients = DATA.clients;
        if (isEditMode) {
            const index = updatedClients.findIndex(c => c.id === selectedRecordId);
            if (index !== -1) {
                updatedClients[index] = { ...updatedClients[index], ...formData, lastUpdate: new Date().toISOString().split('T')[0] };
                showToast('Client updated successfully!', 'success');
            }
        } else {
            const newClient = {
                id: `cl${DATA.clients.length + 1}`,
                ...formData,
                lastUpdate: new Date().toISOString().split('T')[0]
            };
            updatedClients.push(newClient);
            showToast('Client created successfully!', 'success');
        }
        goBack(); // Navigate back to ClientDetail or ClientsList
    };

    if (isEditMode && !existingClient) {
        return (
            <div className="page-container">
                <Breadcrumbs />
                <h1>Client Not Found</h1>
                <p>Cannot find the client to edit.</p>
                <button className="btn btn-secondary" onClick={goBack}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="page-container">
            <Breadcrumbs />
            <div className="page-header">
                <h1 style={{ margin: '0' }}>{isEditMode ? `Edit Client: ${existingClient?.name}` : 'Create New Client'}</h1>
            </div>

            <div className="detail-page-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Client Name (Mandatory)</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                        {errors.name && <p className="form-error">{errors.name}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email (Mandatory)</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        {errors.email && <p className="form-error">{errors.email}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows="3"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <select id="type" name="type" value={formData.type} onChange={handleChange}>
                            <option value="Individual">Individual</option>
                            <option value="Corporate">Corporate</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">{isEditMode ? 'Save Changes' : 'Create Client'}</button>
                        <button type="button" className="btn btn-secondary" onClick={goBack}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const WorkflowProgressView = ({ workflowHistory, currentStatus }) => {
    return (
        <div className="workflow-tracker">
            {workflowHistory.map((stage, index) => {
                const isCompleted = stage.status === 'Completed' || stage.status === 'Approved';
                const isCurrent = stage.status === currentStatus || (stage.status === 'InProgress' && !isCompleted);
                const isSlaBreached = stage.slaStatus === 'Breached';
                const stageClass = `${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isSlaBreached ? 'sla-breach' : ''}`;

                let icon = <FaRegClock />;
                if (isCompleted) icon = <FaCheckCircle />;
                if (isSlaBreached) icon = <FaExclamationTriangle />;
                if (isCurrent && stage.status === 'InProgress') icon = <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />;
                if (isCurrent && stage.status === 'ActionRequired') icon = <FaHammer />;

                return (
                    <div key={index} className={`workflow-stage ${stageClass}`}>
                        <div className="workflow-stage-icon">
                            {icon}
                        </div>
                        <div className="workflow-stage-details">
                            <div className="workflow-stage-title">
                                {stage.stage}
                                {isSlaBreached && (
                                    <span className="sla-breach-indicator">
                                        <FaExclamationTriangle /> SLA Breached
                                    </span>
                                )}
                            </div>
                            <div className="workflow-stage-meta">
                                {stage.date && <span>Date: {stage.date} | </span>}
                                {stage.actor && <span>By: {stage.actor} | </span>}
                                <span>Status: {stage.status}</span>
                            </div>
                            {stage.notes && <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-color)', marginTop: 'var(--spacing-xs)' }}>Notes: {stage.notes}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Define spin animation for FaSpinner
const spinKeyframes = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
// Inject the keyframes (or ensure they are in App.css)
if (typeof document !== 'undefined') { // Check if in browser environment
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = spinKeyframes;
    document.head.appendChild(styleSheet);
}


const AuditLogView = ({ logs }) => {
    const { canAccess } = useContext(AppContext);
    if (!canAccess('action', 'view_audit_logs')) {
        return <p style={{ color: 'var(--status-red)' }}>Access Denied: You do not have permission to view audit logs.</p>;
    }

    if (!logs || logs.length === 0) {
        return <p>No audit logs available for this record.</p>;
    }

    return (
        <table className="audit-log-table">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Details</th>
                    <th>Category</th>
                </tr>
            </thead>
            <tbody>
                {logs.map((log) => (
                    <tr key={log.id}>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                        <td>{log.actor}</td>
                        <td>{log.action}</td>
                        <td>{log.details}</td>
                        <td>{log.category}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

// --- Main App Component ---
export const App = () => {
    const { user, currentScreen, canAccess, selectedRecordId, showGlobalSearch, showFilterPanel } = useContext(AppContext);

    const renderScreen = () => {
        if (!user) {
            return <AuthScreen />;
        }

        // Enforce RBAC for screens
        if (!canAccess('screen', currentScreen)) {
            return (
                <div className="main-content">
                    <Breadcrumbs />
                    <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Access Denied</h1>
                    <p style={{ textAlign: 'center', color: 'var(--status-red)', marginTop: 'var(--spacing-xl)' }}>
                        You do not have permission to view the '{currentScreen}' screen.
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('Dashboard')} style={{ display: 'block', margin: '20px auto' }}>
                        Go to Dashboard
                    </button>
                </div>
            );
        }

        switch (currentScreen) {
            case 'Dashboard':
                return <Dashboard />;
            case 'CasesList':
                return <CasesListScreen />;
            case 'ClientsList':
                return <ClientsListScreen />;
            case 'CaseDetail':
                return <CaseDetailScreen />;
            case 'ClientDetail':
                return <ClientDetailScreen />;
            case 'CaseForm':
                return <CaseForm />;
            case 'ClientForm':
                return <ClientForm />;
            case 'TaskDetail':
                return <TaskDetailScreen />;
            default:
                return (
                    <div className="main-content">
                        <h1>404 - Screen Not Found</h1>
                        <p>The screen '{currentScreen}' could not be found.</p>
                        <button className="btn btn-primary" onClick={() => navigate('Dashboard')}>
                            Go to Dashboard
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="app-container">
            {user && <Header />}
            <main className="main-content">
                {renderScreen()}
            </main>
            <GlobalSearchModal />
            <FilterPanel />
        </div>
    );
};

export default function RootApp() {
    return (
        <AppProvider>
            <App />
        </AppProvider>
    );
}