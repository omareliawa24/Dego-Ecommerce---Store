import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
export interface Category {
  slug: string;
  name: string;
  desc: string;
  image: string;
  count: number;
  gradient: string;
  iconBg: string;
  icon: string;
}
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent  implements OnInit {
    isLoading = true;
  searchTerm = '';
  hoveredId = '';

  categories: Category[] = [
    {
      slug: 'electronics',
      name: "Electronics",
      desc: "Gadgets & tech accessories",
      image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
      count: 124,
      gradient: "linear-gradient(135deg, #dbeafe, #ede9fe)",
      iconBg: "rgba(99,102,241,0.1)",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`
    },
    {
      slug: 'jewelery',
      name: "Jewellery",
      desc: "Elegant rings, necklaces & more",
      image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg",
      count: 87,
      gradient: "linear-gradient(135deg, #fef3c7, #fde8d8)",
      iconBg: "rgba(245,158,11,0.1)",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
    },
    {
      slug: 'men-clothing',
      name: "Men's Clothing",
      desc: "Shirts, jackets & casual wear",
      image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
      count: 203,
      gradient: "linear-gradient(135deg, #dcfce7, #d1fae5)",
      iconBg: "rgba(34,197,94,0.1)",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>`
    },
    {
      slug: 'women-clothing',
      name: "Women's Clothing",
      desc: "Dresses, tops & fashion trends",
      image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
      count: 318,
      gradient: "linear-gradient(135deg, #fce7f3, #fdf2f8)",
      iconBg: "rgba(236,72,153,0.1)",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
    },
    {
      slug: 'home-living',
      name: "Home & Living",
      desc: "Furniture, decor & essentials",
      image: "https://fakestoreapi.com/img/71HblAHs1xL._AC_UY879_-2.jpg",
      count: 156,
      gradient: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
      iconBg: "rgba(20,184,166,0.1)",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    },
    {
      slug: 'sports',
      name: "Sports & Outdoor",
      desc: "Gear for every adventure",
      image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
      count: 91,
      gradient: "linear-gradient(135deg, #fff7ed, #ffedd5)",
      iconBg: "rgba(249,115,22,0.1)",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`
    },
    {
      slug: 'beauty',
      name: "Beauty & Care",
      desc: "Skincare, makeup & fragrances",
      image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
      count: 74,
      gradient: "linear-gradient(135deg, #fdf4ff, #fae8ff)",
      iconBg: "rgba(168,85,247,0.1)",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`
    },
    {
      slug: 'books',
      name: "Books & Media",
      desc: "Knowledge, stories & entertainment",
      image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_FMwebp_QL65_.jpg",
      count: 245,
      gradient: "linear-gradient(135deg, #eff6ff, #dbeafe)",
      iconBg: "rgba(59,130,246,0.1)",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`
    },
  ];

  get filteredCategories(): Category[] {
    if (!this.searchTerm.trim()) return this.categories;
    const term = this.searchTerm.toLowerCase();
    return this.categories.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.desc.toLowerCase().includes(term)
    );
  }

  ngOnInit(): void {
    // Simulate API loading
    setTimeout(() => this.isLoading = false, 900);
  }
}
