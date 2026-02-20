import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../model/product';

/**
 * ProductService - API-Ready Service for Product Operations
 * Manages all product-related data and operations
 *
 * Features:
 * - Mock data for development/testing
 * - Reactive state management with BehaviorSubjects
 * - Easy API integration points marked with TODO
 * -SSR-safe localStorage for favorites/wishlist
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'user_favorites';
  private readonly API_URL = '/api/products'; // Will be replaced with real endpoint

  // State management
  private products = new BehaviorSubject<Product[]>([]);
  private favoriteIds = new BehaviorSubject<number[]>([]);
  private loading = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<string | null>(null);

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadFavorites();
  }

  // ============ PUBLIC OBSERVABLES ============

  /**
   * Observable for all products
   */
  getProducts$(): Observable<Product[]> {
    return this.products.asObservable();
  }

  /**
   * Observable for favorite product IDs
   */
  getFavorites$(): Observable<number[]> {
    return this.favoriteIds.asObservable();
  }

  /**
   * Observable for loading state
   */
  getLoading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  /**
   * Observable for error messages
   */
  getError$(): Observable<string | null> {
    return this.error.asObservable();
  }

  // ============ PRODUCT OPERATIONS ============

  /**
   * Load products from API or mock data
   * TODO: Replace with real HTTP call:
   * return this.http.get<Product[]>(`${this.API_URL}`).pipe(...)
   */
  loadProducts(): void {
    this.loading.next(true);
    this.error.next(null);

    // Mock delay to simulate network request
    setTimeout(() => {
      try {
        // TODO: Replace with real API call
        const mockProducts = this.getMockProducts();
        this.products.next(mockProducts);
        this.loading.next(false);
      } catch (err) {
        this.error.next('Failed to load products');
        this.loading.next(false);
      }
    }, 500);
  }

  /**
   * Get single product by ID
   * TODO: Replace with: this.http.get<Product>(`${this.API_URL}/${id}`)
   */
  getProductById(id: number): Observable<Product | undefined> {
    return new Observable(observer => {
      setTimeout(() => {
        const product = this.products.value.find(p => p.id === id);
        observer.next(product);
        observer.complete();
      }, 200);
    });
  }

  /**
   * Search products by query
   * TODO: Replace with: this.http.get<Product[]>(`${this.API_URL}/search?q=${query}`)
   */
  searchProducts(query: string): Observable<Product[]> {
    return new Observable(observer => {
      const filtered = this.products.value.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
      observer.next(filtered);
      observer.complete();
    });
  }

  /**
   * Get products by category
   * TODO: Replace with: this.http.get<Product[]>(`${this.API_URL}?category=${category}`)
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    return new Observable(observer => {
      const filtered = this.products.value.filter(p => p.category === category);
      observer.next(filtered);
      observer.complete();
    });
  }

  // ============ FAVORITE MANAGEMENT ============

  /**
   * Add product to favorites
   * TODO: API call: this.http.post(`${this.API_URL}/${productId}/favorite`, {})
   */
  addToFavorites(productId: number): void {
    const favorites = this.favoriteIds.value;
    if (!favorites.includes(productId)) {
      favorites.push(productId);
      this.favoriteIds.next([...favorites]);
      this.saveFavorites();
    }
  }

  /**
   * Remove product from favorites
   * TODO: API call: this.http.delete(`${this.API_URL}/${productId}/favorite`)
   */
  removeFromFavorites(productId: number): void {
    const filtered = this.favoriteIds.value.filter(id => id !== productId);
    this.favoriteIds.next(filtered);
    this.saveFavorites();
  }

  /**
   * Check if product is favorited
   */
  isFavorited(productId: number): boolean {
    return this.favoriteIds.value.includes(productId);
  }

  /**
   * Get all favorited products
   */
  getFavoritedProducts(): Product[] {
    return this.products.value.filter(p => this.isFavorited(p.id));
  }

  // ============ MOCK DATA ============

  /**
   * Mock products for development/testing
   * Replace this entire function with API call
   */
  private getMockProducts(): Product[] {
    return [
      {
        id: 1,
        title: 'Wireless Headphones',
        price: 99.99,
        description: 'High-quality wireless headphones with noise cancellation',
        category: 'Electronics',
        image: 'https://via.placeholder.com/300?text=Headphones'
      },
      {
        id: 2,
        title: 'USB-C Cable',
        price: 15.99,
        description: 'Fast charging USB-C cable, 2 meters',
        category: 'Accessories',
        image: 'https://via.placeholder.com/300?text=USB+Cable'
      },
      {
        id: 3,
        title: 'Laptop Stand',
        price: 49.99,
        description: 'Ergonomic aluminum laptop stand',
        category: 'Office',
        image: 'https://via.placeholder.com/300?text=Laptop+Stand'
      },
      {
        id: 4,
        title: 'Wireless Mouse',
        price: 39.99,
        description: 'Precision wireless mouse with rechargeable battery',
        category: 'Electronics',
        image: 'https://via.placeholder.com/300?text=Mouse'
      },
      {
        id: 5,
        title: 'Mechanical Keyboard',
        price: 129.99,
        description: 'RGB mechanical keyboard with custom switches',
        category: 'Electronics',
        image: 'https://via.placeholder.com/300?text=Keyboard'
      }
    ];
  }

  // ============ PERSISTENCE (localStorage) ============

  /**
   * Load favorites from localStorage (SSR-safe)
   */
  private loadFavorites(): void {
    if (!this.isBrowser) return;

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.favoriteIds.next(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  /**
   * Save favorites to localStorage (SSR-safe)
   */
  private saveFavorites(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favoriteIds.value));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  // ============ API INTEGRATION TEMPLATE ============

  /**
   * Template for real API integration:
   *
   * constructor(
   *   private http: HttpClient,
   *   @Inject(PLATFORM_ID) platformId: Object
   * ) { ... }
   *
   * loadProducts(): void {
   *   this.loading.next(true);
   *   this.http.get<Product[]>(`${this.API_URL}`)
   *     .pipe(
   *       finalize(() => this.loading.next(false)),
   *       catchError(err => {
   *         this.error.next('Failed to load products');
   *         return of([]);
   *       })
   *     )
   *     .subscribe(products => this.products.next(products));
   * }
   *
   * getProductById(id: number): Observable<Product> {
   *   return this.http.get<Product>(`${this.API_URL}/${id}`)
   *     .pipe(
   *       catchError(err => {
   *         this.error.next('Product not found');
   *         throw err;
   *       })
   *     );
   * }
   */
}
