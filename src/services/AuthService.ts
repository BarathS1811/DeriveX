interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  isLoggedIn: boolean;
  wallet: {
    balance: number;
    availableMargin: number;
    usedMargin: number;
  };
  settings: {
    marketDataAPI: any;
    newsAPI: any;
    tradingSettings: any;
    notifications: any;
  };
}

class AuthService {
  private currentUser: User | null = null;
  private users: User[] = [];

  constructor() {
    this.loadUsers();
    this.loadCurrentUser();
  }

  private loadUsers() {
    const savedUsers = localStorage.getItem('marketAI_users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }
  }

  private saveUsers() {
    localStorage.setItem('marketAI_users', JSON.stringify(this.users));
  }

  private loadCurrentUser() {
    const savedUser = localStorage.getItem('marketAI_currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  private saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem('marketAI_currentUser', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('marketAI_currentUser');
    }
  }

  register(username: string, email: string, phone: string, password: string): { success: boolean; message: string } {
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return { success: false, message: 'User already exists with this email or username' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      phone,
      password, // In production, this should be hashed
      createdAt: new Date(),
      isLoggedIn: false,
      wallet: {
        balance: 0,
        availableMargin: 0,
        usedMargin: 0
      },
      settings: {
        marketDataAPI: null,
        newsAPI: null,
        tradingSettings: null,
        notifications: null
      }
    };

    this.users.push(newUser);
    this.saveUsers();
    return { success: true, message: 'Registration successful' };
  }

  login(emailOrUsername: string, password: string): { success: boolean; message: string; user?: User } {
    const user = this.users.find(u => 
      (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password
    );

    if (user) {
      user.isLoggedIn = true;
      this.currentUser = user;
      this.saveUsers();
      this.saveCurrentUser();
      return { success: true, message: 'Login successful', user };
    }

    return { success: false, message: 'Invalid credentials' };
  }

  logout(): void {
    if (this.currentUser) {
      this.currentUser.isLoggedIn = false;
      const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
      if (userIndex !== -1) {
        this.users[userIndex] = this.currentUser;
        this.saveUsers();
      }
      this.currentUser = null;
      this.saveCurrentUser();
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null && this.currentUser.isLoggedIn;
  }

  updateUserSettings(settings: any): void {
    if (this.currentUser) {
      this.currentUser.settings = { ...this.currentUser.settings, ...settings };
      const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
      if (userIndex !== -1) {
        this.users[userIndex] = this.currentUser;
        this.saveUsers();
        this.saveCurrentUser();
      }
    }
  }

  updateWallet(walletData: Partial<User['wallet']>): void {
    if (this.currentUser) {
      this.currentUser.wallet = { ...this.currentUser.wallet, ...walletData };
      const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
      if (userIndex !== -1) {
        this.users[userIndex] = this.currentUser;
        this.saveUsers();
        this.saveCurrentUser();
      }
    }
  }

  addMoney(amount: number): { success: boolean; message: string } {
    if (!this.currentUser) {
      return { success: false, message: 'User not logged in' };
    }

    if (amount <= 0) {
      return { success: false, message: 'Invalid amount' };
    }

    this.currentUser.wallet.balance += amount;
    this.currentUser.wallet.availableMargin += amount;
    
    const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
    if (userIndex !== -1) {
      this.users[userIndex] = this.currentUser;
      this.saveUsers();
      this.saveCurrentUser();
    }

    return { success: true, message: `₹${amount} added successfully` };
  }

  withdrawMoney(amount: number): { success: boolean; message: string } {
    if (!this.currentUser) {
      return { success: false, message: 'User not logged in' };
    }

    if (amount <= 0) {
      return { success: false, message: 'Invalid amount' };
    }

    if (amount > this.currentUser.wallet.availableMargin) {
      return { success: false, message: 'Insufficient balance' };
    }

    this.currentUser.wallet.balance -= amount;
    this.currentUser.wallet.availableMargin -= amount;
    
    const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
    if (userIndex !== -1) {
      this.users[userIndex] = this.currentUser;
      this.saveUsers();
      this.saveCurrentUser();
    }

    return { success: true, message: `₹${amount} withdrawn successfully` };
  }
}

export const authService = new AuthService();