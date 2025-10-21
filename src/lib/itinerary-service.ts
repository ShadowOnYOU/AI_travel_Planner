import { TravelItinerary, ItineraryCollection, ItineraryFilterOptions, ItineraryStats } from '@/types/ai';
import { supabase, isSupabaseConfigured } from './supabase';

/**
 * 行程管理服务
 * 支持本地存储和 Supabase 数据库存储
 */
export class ItineraryService {
  private static readonly LOCAL_STORAGE_KEY = 'travel_itineraries';
  private static readonly CURRENT_ITINERARY_KEY = 'currentItinerary';

  // 获取所有行程（带筛选）
  static async getAllItineraries(
    userId?: string,
    options: ItineraryFilterOptions = {}
  ): Promise<ItineraryCollection> {
    if (isSupabaseConfigured() && userId) {
      return this.getItinerariesFromSupabase(userId, options);
    } else {
      return this.getItinerariesFromLocalStorage(options);
    }
  }

  // 根据 ID 获取单个行程
  static async getItineraryById(id: string, userId?: string): Promise<TravelItinerary | null> {
    if (isSupabaseConfigured() && userId) {
      return this.getItineraryFromSupabase(id, userId);
    } else {
      return this.getItineraryFromLocalStorage(id);
    }
  }

  // 保存行程
  static async saveItinerary(itinerary: TravelItinerary, userId?: string): Promise<TravelItinerary> {
    const now = new Date().toISOString();
    const updatedItinerary: TravelItinerary = {
      ...itinerary,
      userId,
      updatedAt: now,
      createdAt: itinerary.createdAt || now,
    };

    if (isSupabaseConfigured() && userId) {
      return this.saveItineraryToSupabase(updatedItinerary);
    } else {
      return this.saveItineraryToLocalStorage(updatedItinerary);
    }
  }

  // 删除行程
  static async deleteItinerary(id: string, userId?: string): Promise<boolean> {
    if (isSupabaseConfigured() && userId) {
      return this.deleteItineraryFromSupabase(id, userId);
    } else {
      return this.deleteItineraryFromLocalStorage(id);
    }
  }

  // 获取行程统计
  static async getItineraryStats(userId?: string): Promise<ItineraryStats> {
    if (isSupabaseConfigured() && userId) {
      return this.getStatsFromSupabase(userId);
    } else {
      return this.getStatsFromLocalStorage();
    }
  }

  // 设置当前查看的行程
  static setCurrentItinerary(itinerary: TravelItinerary): void {
    localStorage.setItem(this.CURRENT_ITINERARY_KEY, JSON.stringify(itinerary));
  }

  // 获取当前查看的行程
  static getCurrentItinerary(): TravelItinerary | null {
    try {
      const stored = localStorage.getItem(this.CURRENT_ITINERARY_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('获取当前行程失败:', error);
      return null;
    }
  }

  // 复制行程
  static async duplicateItinerary(
    originalId: string, 
    userId?: string,
    modifications?: Partial<TravelItinerary>
  ): Promise<TravelItinerary | null> {
    const original = await this.getItineraryById(originalId, userId);
    if (!original) return null;

    const duplicated: TravelItinerary = {
      ...original,
      ...modifications,
      id: this.generateId(),
      title: modifications?.title || `${original.title} (副本)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.saveItinerary(duplicated, userId);
  }

  // === 本地存储实现 ===
  private static getItinerariesFromLocalStorage(options: ItineraryFilterOptions = {}): ItineraryCollection {
    try {
      console.log('从本地存储获取行程:', this.LOCAL_STORAGE_KEY);
      
      const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      let itineraries: TravelItinerary[] = stored ? JSON.parse(stored) : [];
      
      console.log('原始行程数量:', itineraries.length);
      console.log('行程列表:', itineraries.map(i => ({ id: i.id, title: i.title })));

      // 应用筛选
      itineraries = this.applyFilters(itineraries, options);
      console.log('筛选后行程数量:', itineraries.length);

      // 分页
      const page = options.page || 1;
      const limit = options.limit || 10;
      const startIndex = (page - 1) * limit;
      const paginatedItineraries = itineraries.slice(startIndex, startIndex + limit);

      return {
        total: itineraries.length,
        itineraries: paginatedItineraries,
        page,
        limit,
      };
    } catch (error) {
      console.error('从本地存储获取行程失败:', error);
      return { total: 0, itineraries: [], page: 1, limit: 10 };
    }
  }

  private static getItineraryFromLocalStorage(id: string): TravelItinerary | null {
    try {
      const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      const itineraries: TravelItinerary[] = stored ? JSON.parse(stored) : [];
      return itineraries.find(item => item.id === id) || null;
    } catch (error) {
      console.error('从本地存储获取行程失败:', error);
      return null;
    }
  }

  private static saveItineraryToLocalStorage(itinerary: TravelItinerary): TravelItinerary {
    try {
      console.log('保存到本地存储:', this.LOCAL_STORAGE_KEY);
      
      const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      let itineraries: TravelItinerary[] = stored ? JSON.parse(stored) : [];
      
      console.log('当前存储的行程数量:', itineraries.length);
      console.log('要保存的行程ID:', itinerary.id);

      const existingIndex = itineraries.findIndex(item => item.id === itinerary.id);
      if (existingIndex >= 0) {
        console.log('更新现有行程，索引:', existingIndex);
        itineraries[existingIndex] = itinerary;
      } else {
        console.log('添加新行程');
        itineraries.push(itinerary);
      }

      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(itineraries));
      console.log('保存后的行程数量:', itineraries.length);
      
      return itinerary;
    } catch (error) {
      console.error('保存行程到本地存储失败:', error);
      throw error;
    }
  }

  private static deleteItineraryFromLocalStorage(id: string): boolean {
    try {
      const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      let itineraries: TravelItinerary[] = stored ? JSON.parse(stored) : [];

      const originalLength = itineraries.length;
      itineraries = itineraries.filter(item => item.id !== id);

      if (itineraries.length < originalLength) {
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(itineraries));
        return true;
      }
      return false;
    } catch (error) {
      console.error('从本地存储删除行程失败:', error);
      return false;
    }
  }

  private static getStatsFromLocalStorage(): ItineraryStats {
    try {
      const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      const itineraries: TravelItinerary[] = stored ? JSON.parse(stored) : [];

      const totalItineraries = itineraries.length;
      const completedItineraries = itineraries.filter(item => item.status === 'completed').length;
      const totalSpent = itineraries.reduce((sum, item) => sum + item.actualCost, 0);
      const averageCost = totalItineraries > 0 ? totalSpent / totalItineraries : 0;

      // 统计目的地
      const destinationCount: Record<string, number> = {};
      itineraries.forEach(item => {
        destinationCount[item.destination] = (destinationCount[item.destination] || 0) + 1;
      });
      const favoriteDestinations = Object.entries(destinationCount)
        .map(([destination, count]) => ({ destination, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // 月度活动统计
      const monthlyActivity: Record<string, { count: number; totalCost: number }> = {};
      itineraries.forEach(item => {
        const month = new Date(item.createdAt).toISOString().slice(0, 7);
        if (!monthlyActivity[month]) {
          monthlyActivity[month] = { count: 0, totalCost: 0 };
        }
        monthlyActivity[month].count++;
        monthlyActivity[month].totalCost += item.actualCost;
      });

      const monthlyActivityArray = Object.entries(monthlyActivity)
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => a.month.localeCompare(b.month));

      return {
        totalItineraries,
        completedItineraries,
        totalSpent,
        averageCost,
        favoriteDestinations,
        monthlyActivity: monthlyActivityArray,
      };
    } catch (error) {
      console.error('获取本地存储统计失败:', error);
      return {
        totalItineraries: 0,
        completedItineraries: 0,
        totalSpent: 0,
        averageCost: 0,
        favoriteDestinations: [],
        monthlyActivity: [],
      };
    }
  }

  // === Supabase 实现 ===
  private static async getItinerariesFromSupabase(
    userId: string, 
    options: ItineraryFilterOptions = {}
  ): Promise<ItineraryCollection> {
    try {
      console.log('从 Supabase 获取行程列表，用户ID:', userId);
      
      let query = supabase
        .from('travel_itineraries')
        .select('*')
        .eq('user_id', userId);

      // 应用筛选条件
      if (options.search) {
        query = query.or(`title.ilike.%${options.search}%,destination.ilike.%${options.search}%,summary.ilike.%${options.search}%`);
      }

      if (options.destination) {
        query = query.eq('destination', options.destination);
      }

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.dateRange) {
        query = query
          .gte('start_date', options.dateRange.start)
          .lte('start_date', options.dateRange.end);
      }

      if (options.budgetRange) {
        query = query
          .gte('total_budget', options.budgetRange.min)
          .lte('total_budget', options.budgetRange.max);
      }

      // 排序
      if (options.sortBy) {
        const column = this.mapSortField(options.sortBy);
        const ascending = options.sortOrder !== 'desc';
        query = query.order(column, { ascending });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // 先获取总数
      const { count } = await supabase
        .from('travel_itineraries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // 分页
      const page = options.page || 1;
      const limit = options.limit || 10;
      const startIndex = (page - 1) * limit;
      
      query = query.range(startIndex, startIndex + limit - 1);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase 查询错误:', error);
        throw error;
      }

      console.log('Supabase 查询结果:', data?.length, '条记录');

      const itineraries = (data || []).map(this.mapSupabaseToItinerary);

      return {
        total: count || 0,
        itineraries,
        page,
        limit,
      };
    } catch (error: any) {
      console.error('从 Supabase 获取行程失败:', error);
      // 如果是表不存在错误，降级到 localStorage
      if (error?.code === 'PGRST205' || error?.message?.includes('travel_itineraries')) {
        console.warn('数据库表不存在，降级使用 localStorage');
        return this.getItinerariesFromLocalStorage(options);
      }
      throw error;
    }
  }

  private static async getItineraryFromSupabase(id: string, userId: string): Promise<TravelItinerary | null> {
    try {
      console.log('从 Supabase 获取单个行程:', id);
      
      const { data, error } = await supabase
        .from('travel_itineraries')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // 记录不存在
          return null;
        }
        console.error('Supabase 查询错误:', error);
        throw error;
      }

      return data ? this.mapSupabaseToItinerary(data) : null;
    } catch (error: any) {
      console.error('从 Supabase 获取行程失败:', error);
      // 如果是表不存在错误，降级到 localStorage
      if (error?.code === 'PGRST205' || error?.message?.includes('travel_itineraries')) {
        console.warn('数据库表不存在，降级使用 localStorage');
        return this.getItineraryFromLocalStorage(id);
      }
      throw error;
    }
  }

  private static async saveItineraryToSupabase(itinerary: TravelItinerary): Promise<TravelItinerary> {
    try {
      console.log('保存行程到 Supabase:', itinerary.id);
      
      const supabaseData = this.mapItineraryToSupabase(itinerary);

      // 尝试更新，如果不存在则插入
      const { data, error } = await supabase
        .from('travel_itineraries')
        .upsert(supabaseData, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase 保存错误:', error);
        throw error;
      }

      console.log('Supabase 保存成功');
      return this.mapSupabaseToItinerary(data);
    } catch (error: any) {
      console.error('保存行程到 Supabase 失败:', error);
      // 如果是表不存在错误，降级到 localStorage
      if (error?.code === 'PGRST205' || error?.message?.includes('travel_itineraries')) {
        console.warn('数据库表不存在，降级使用 localStorage');
        this.saveItineraryToLocalStorage(itinerary);
        return itinerary;
      }
      throw error;
    }
  }

  private static async deleteItineraryFromSupabase(id: string, userId: string): Promise<boolean> {
    try {
      console.log('从 Supabase 删除行程:', id);
      
      const { error } = await supabase
        .from('travel_itineraries')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Supabase 删除错误:', error);
        throw error;
      }

      console.log('Supabase 删除成功');
      return true;
    } catch (error: any) {
      console.error('从 Supabase 删除行程失败:', error);
      // 如果是表不存在错误，降级到 localStorage
      if (error?.code === 'PGRST205' || error?.message?.includes('travel_itineraries')) {
        console.warn('数据库表不存在，降级使用 localStorage');
        return this.deleteItineraryFromLocalStorage(id);
      }
      throw error;
    }
  }

  private static async getStatsFromSupabase(userId: string): Promise<ItineraryStats> {
    try {
      console.log('从 Supabase 获取统计信息');
      
      const { data, error } = await supabase
        .from('travel_itineraries')
        .select('status, actual_cost, destination, created_at')
        .eq('user_id', userId);

      if (error) {
        console.error('Supabase 统计查询错误:', error);
        throw error;
      }

      const itineraries = data || [];
      const totalItineraries = itineraries.length;
      const completedItineraries = itineraries.filter((item: any) => item.status === 'completed').length;
      const totalSpent = itineraries.reduce((sum: number, item: any) => sum + (item.actual_cost || 0), 0);
      const averageCost = totalItineraries > 0 ? totalSpent / totalItineraries : 0;

      // 统计目的地
      const destinationCount: Record<string, number> = {};
      itineraries.forEach((item: any) => {
        if (item.destination) {
          destinationCount[item.destination] = (destinationCount[item.destination] || 0) + 1;
        }
      });
      const favoriteDestinations = Object.entries(destinationCount)
        .map(([destination, count]) => ({ destination, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // 月度活动统计
      const monthlyActivity: Record<string, { count: number; totalCost: number }> = {};
      itineraries.forEach((item: any) => {
        if (item.created_at) {
          const month = new Date(item.created_at).toISOString().slice(0, 7);
          if (!monthlyActivity[month]) {
            monthlyActivity[month] = { count: 0, totalCost: 0 };
          }
          monthlyActivity[month].count++;
          monthlyActivity[month].totalCost += item.actual_cost || 0;
        }
      });

      const monthlyActivityArray = Object.entries(monthlyActivity)
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => a.month.localeCompare(b.month));

      return {
        totalItineraries,
        completedItineraries,
        totalSpent,
        averageCost,
        favoriteDestinations,
        monthlyActivity: monthlyActivityArray,
      };
    } catch (error: any) {
      console.error('从 Supabase 获取统计失败:', error);
      // 如果是表不存在错误，降级到 localStorage
      if (error?.code === 'PGRST205' || error?.message?.includes('travel_itineraries')) {
        console.warn('数据库表不存在，降级使用 localStorage');
        return this.getStatsFromLocalStorage();
      }
      throw error;
    }
  }

  // === 工具方法 ===
  private static applyFilters(itineraries: TravelItinerary[], options: ItineraryFilterOptions): TravelItinerary[] {
    let filtered = [...itineraries];

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.destination.toLowerCase().includes(searchLower) ||
        item.summary.toLowerCase().includes(searchLower)
      );
    }

    if (options.destination) {
      filtered = filtered.filter(item => item.destination === options.destination);
    }

    if (options.status) {
      filtered = filtered.filter(item => (item.status || 'draft') === options.status);
    }

    if (options.dateRange) {
      filtered = filtered.filter(item => {
        const startDate = new Date(item.startDate);
        const filterStart = new Date(options.dateRange!.start);
        const filterEnd = new Date(options.dateRange!.end);
        return startDate >= filterStart && startDate <= filterEnd;
      });
    }

    if (options.budgetRange) {
      filtered = filtered.filter(item =>
        item.totalBudget >= options.budgetRange!.min &&
        item.totalBudget <= options.budgetRange!.max
      );
    }

    if (options.tags && options.tags.length > 0) {
      filtered = filtered.filter(item =>
        options.tags!.some(tag => (item.tags || []).includes(tag))
      );
    }

    // 排序
    if (options.sortBy) {
      filtered.sort((a, b) => {
        const order = options.sortOrder === 'desc' ? -1 : 1;
        const aValue = a[options.sortBy!];
        const bValue = b[options.sortBy!];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return order * aValue.localeCompare(bValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return order * (aValue - bValue);
        }
        return 0;
      });
    }

    return filtered;
  }

  private static generateId(): string {
    return `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // === 数据映射辅助方法 ===
  private static mapSortField(sortBy: string): string {
    const fieldMapping: Record<string, string> = {
      'title': 'title',
      'destination': 'destination', 
      'startDate': 'start_date',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at',
      'actualCost': 'actual_cost',
      'status': 'status'
    };
    return fieldMapping[sortBy] || 'created_at';
  }

  private static mapSupabaseToItinerary(data: any): TravelItinerary {
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      destination: data.destination,
      startDate: data.start_date,
      endDate: data.end_date,
      totalDays: data.total_days,
      travelers: data.travelers,
      totalBudget: data.total_budget,
      actualCost: data.actual_cost,
      travelStyle: data.travel_style || '',
      days: data.days || [],
      summary: data.summary,
      recommendations: data.recommendations || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      // 新增字段（可选）
      status: data.status || 'draft',
      tags: data.tags || [],
      isPublic: data.is_public || false
    };
  }

  private static mapItineraryToSupabase(itinerary: TravelItinerary): any {
    return {
      id: itinerary.id,
      user_id: itinerary.userId,
      title: itinerary.title,
      destination: itinerary.destination,
      start_date: itinerary.startDate,
      end_date: itinerary.endDate,
      total_days: itinerary.totalDays,
      travelers: itinerary.travelers,
      total_budget: itinerary.totalBudget,
      actual_cost: itinerary.actualCost,
      travel_style: itinerary.travelStyle,
      days: itinerary.days,
      summary: itinerary.summary,
      recommendations: itinerary.recommendations,
      created_at: itinerary.createdAt,
      updated_at: itinerary.updatedAt || new Date().toISOString(),
      // 新增字段
      status: itinerary.status || 'draft',
      tags: itinerary.tags || [],
      is_public: itinerary.isPublic || false
    };
  }
}