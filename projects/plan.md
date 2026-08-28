# Angular Sinyal Tabanlı DataTable — Ürün Gereksinim Dokümanı

Doküman türü: PRD (Product Requirements Document / Ürün Gereksinim Dokümanı)
Sürüm: 1.0
Tarih: 28 Ağustos 2026

---

## 1. Ürün Tanımı

Angular 21 ve üzeri için, sinyal (signal) tabanlı, zonesiz (zoneless) çalışan bir veri tablosu kütüphanesi.

İki katman halinde sunulur:

1. **Çekirdek katman (core):** Saf TypeScript mantığı. DOM (Document Object Model / Belge Nesne Modeli) ile hiçbir teması yok. Sıralama, filtreleme, sayfalama, seçim ve sütun görünürlüğü durumunu yönetir.
2. **Bileşen katmanı (component):** Çekirdeği tüketen, minimum stille gelen, hazır kullanılabilir Angular bileşeni.

Kullanıcı üç farklı seviyede kullanabilir:

1. Bileşeni doğrudan kullanır, veriyi ve sütunları verir, biter.
2. Bileşeni kullanır ama çekirdek örneğini kendisi oluşturup dışarıdan verir.
3. Sadece çekirdeği kullanır, tüm HTML'i kendisi yazar.

---

## 2. Konumlandırma ve Farklılaşma

Kütüphanenin README (Beni Oku) dosyasının ilk paragrafında savunulacak cümle şudur:

> Angular 21+ için sıfır bağımlılıklı, sinyallerle yazılmış, minimum stille gelen ve her iç parçasına dışarıdan sınıf verilebilen bir veri tablosu.

Rakiplerden ayrışma noktaları:

1. TanStack Table tamamen başsızdır (headless), hiç arayüz vermez. Bu kütüphane minimum bir arayüz verir.
2. PrimeNG Table ve AG Grid hazır arayüz verir ama ezmesi zordur. Bu kütüphanede ezme kavramı yoktur; sınıflar doğrudan enjekte edilir.
3. Angular Material Table sürükleyici bir bağımlılık ağacı getirir. Bu kütüphanenin çalışma zamanı bağımlılığı sıfırdır.

---

## 3. Teknik Kısıtlar (Kararlaştırılmış)

1. Minimum Angular sürümü: 21.0.0
2. Zonesiz çalışma zorunludur. Zone.js varsayımı içeren hiçbir kod yazılmaz.
3. Çalışma zamanı bağımlılığı sıfırdır. Sadece `@angular/core` ve `@angular/common` eşdeğer bağımlılık (peer dependency) olarak tanımlanır. Angular CDK (Component Dev Kit / Bileşen Geliştirme Kiti) dahi kullanılmaz.
4. Dağıtım: tek npm (Node Package Manager / Node Paket Yöneticisi) paketi, iki giriş noktası.
5. Veri modu: sadece istemci tarafı. Ancak sıralama ve filtreleme fonksiyonları dışarıdan verilebilir olacak, böylece ileride sunucu tarafı desteği kırıcı değişiklik olmadan eklenebilecek.
6. Lisans: MIT
7. Tüm kod TypeScript strict modda yazılır.
8. Kod içindeki yorum satırları İngilizce yazılır.
9. Varsayılan stiller `@layer` içine alınır ve isteğe bağlı olarak içe aktarılır.
10. Erişilebilirlik pazarlık dışıdır. ARIA (Accessible Rich Internet Applications / Erişilebilir Zengin İnternet Uygulamaları) öznitelikleri ve klavye desteği v1'e dahildir.

---

## 4. Kapsam

### 4.1 v1 içinde olanlar

1. Tek sütun ve çoklu sütun sıralama
2. Global metin filtresi
3. Sütun bazlı filtre
4. Sayfalama
5. Satır seçimi: tek satır, çoklu satır, tümünü seç
6. Sütun görünürlüğü açma ve kapama
7. Boş durum (empty state) gösterimi
8. Yükleniyor durumu (loading state) gösterimi
9. `ng-template` ile hücre, başlık ve boş durum şablonu özelleştirme
10. Parça bazlı sınıf enjeksiyonu
11. İsteğe bağlı varsayılan stil dosyası
12. Klavye ile gezinme ve ARIA desteği

### 4.2 v1 dışında bırakılanlar

1. Sanallaştırma (virtualization)
2. Gruplama ve toplama (aggregation)
3. Ağaç yapılı satırlar
4. Satır içi düzenleme (inline editing)
5. Sütun yeniden boyutlandırma ve sürükleyerek taşıma
6. Excel veya CSV (Comma Separated Values / Virgülle Ayrılmış Değerler) dışa aktarma
7. Sunucu tarafı veri modu
8. Sabitlenmiş sütunlar (column pinning)

Bu maddeler README dosyasında "Yol Haritası" başlığı altında açıkça listelenir. Kapsamı bilinçli olarak dar tuttuğunu yazmak, eksiklik gibi görünmesini engeller.

---

## 5. Çekirdek Katman Tasarımı

### 5.1 Sütun tanımı

```typescript
export type ColumnAlign = 'start' | 'center' | 'end';

export interface ColumnDef<T> {
  /** Unique identifier for the column. Also used as the default accessor key. */
  readonly id: string;

  /** Text shown in the header cell. */
  readonly header: string;

  /** Extracts the raw value from a row. Defaults to row[id]. */
  readonly accessor?: (row: T) => unknown;

  /** Enables sorting on this column. Default: true */
  readonly sortable?: boolean;

  /** Enables per-column filtering. Default: false */
  readonly filterable?: boolean;

  /**
   * Custom comparator. Receives the two raw values produced by the accessor.
   * Return a negative number, zero, or a positive number.
   */
  readonly sortFn?: (a: unknown, b: unknown) => number;

  /** Custom predicate for filtering. Receives the raw value and the search term. */
  readonly filterFn?: (value: unknown, term: string) => boolean;

  /** Whether the column is visible on first render. Default: true */
  readonly visible?: boolean;

  /** Applied as inline width on the column. Example: '120px', '20%' */
  readonly width?: string;

  /** Horizontal alignment of the cell content. Default: 'start' */
  readonly align?: ColumnAlign;
}
```

Tasarım notları:

1. `id` alanı `keyof T` yerine `string` olarak tanımlandı. Sebebi, hesaplanmış sütunlara (örneğin ad ve soyadı birleştiren bir sütun) izin vermek. Tip güvenliğini `accessor` fonksiyonu üzerinden sağlıyoruz.
2. `sortFn` ve `filterFn` alanları, ileride sunucu tarafı desteği eklerken kapıyı açık tutar.
3. Bütün alanlar `readonly`. Sütun tanımı değişmez (immutable) bir yapıdır.

### 5.2 Durum tipleri

```typescript
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  readonly columnId: string;
  readonly direction: SortDirection;
}

export interface ColumnFilterState {
  readonly columnId: string;
  readonly term: string;
}

export type RowId = string | number;
```

### 5.3 Tablo seçenekleri

```typescript
export interface TableOptions<T> {
  /** Source rows. Never mutated by the table. */
  readonly data: readonly T[];

  readonly columns: readonly ColumnDef<T>[];

  /**
   * Produces a stable identity for a row. Required for selection and for
   * the track expression in the template. Defaults to the array index,
   * which disables stable selection across data changes.
   */
  readonly rowId?: (row: T, index: number) => RowId;

  /** Number of rows per page. Default: 10 */
  readonly pageSize?: number;

  /** Allow more than one column to be sorted at once. Default: false */
  readonly multiSort?: boolean;

  /** Initial sort applied on creation. */
  readonly initialSort?: readonly SortState[];

  /**
   * Fallback comparator used when a column has no sortFn.
   * Default implementation handles string, number, boolean, Date and null.
   */
  readonly defaultSortFn?: (a: unknown, b: unknown) => number;

  /**
   * Fallback predicate used when a column has no filterFn.
   * Default implementation is a case-insensitive substring match.
   */
  readonly defaultFilterFn?: (value: unknown, term: string) => boolean;
}
```

### 5.4 Genel arayüz

```typescript
export interface TableRow<T> {
  readonly id: RowId;
  readonly index: number;
  readonly data: T;
  readonly selected: boolean;
}

export interface TableCell {
  readonly columnId: string;
  readonly value: unknown;
}

export interface TableApi<T> {
  // --- read-only derived state ---

  /** Rows after filtering, sorting and pagination. */
  readonly rows: Signal<readonly TableRow<T>[]>;

  /** Columns currently visible, in display order. */
  readonly visibleColumns: Signal<readonly ColumnDef<T>[]>;

  /** Row count after filtering, before pagination. */
  readonly filteredCount: Signal<number>;

  /** Total number of pages. Minimum 1. */
  readonly pageCount: Signal<number>;

  /** Zero-based page index. */
  readonly pageIndex: Signal<number>;

  readonly pageSize: Signal<number>;
  readonly sort: Signal<readonly SortState[]>;
  readonly globalFilter: Signal<string>;
  readonly columnFilters: Signal<readonly ColumnFilterState[]>;
  readonly selectedIds: Signal<ReadonlySet<RowId>>;
  readonly allPageRowsSelected: Signal<boolean>;
  readonly somePageRowsSelected: Signal<boolean>;

  // --- commands ---

  /**
   * Cycles the column through asc, desc and unsorted.
   * When multiSort is false, clears any other active sort first.
   */
  toggleSort(columnId: string): void;
  setSort(sort: readonly SortState[]): void;
  clearSort(): void;

  setGlobalFilter(term: string): void;
  setColumnFilter(columnId: string, term: string): void;
  clearFilters(): void;

  setPageIndex(index: number): void;
  nextPage(): void;
  previousPage(): void;
  firstPage(): void;
  lastPage(): void;
  setPageSize(size: number): void;

  toggleRowSelection(id: RowId): void;
  selectRow(id: RowId): void;
  deselectRow(id: RowId): void;
  toggleAllPageRows(): void;
  clearSelection(): void;
  getSelectedRows(): readonly T[];

  setColumnVisibility(columnId: string, visible: boolean): void;
  toggleColumnVisibility(columnId: string): void;
  resetColumnVisibility(): void;
}
```

### 5.5 Fabrika fonksiyonu

```typescript
export function createTable<T>(options: TableOptions<T> | (() => TableOptions<T>)): TableApi<T>;
```

Fonksiyon hem düz nesne hem de fonksiyon kabul eder. Fonksiyon verildiğinde reaktif olur, yani `data` veya `columns` bir sinyalden geliyorsa tablo kendiliğinden güncellenir.

### 5.6 Türetme zinciri

Hesaplama sırası kesin olarak şudur ve değiştirilemez:

1. Kaynak veri
2. Global filtre uygulanır
3. Sütun filtreleri uygulanır
4. Sıralama uygulanır
5. Sayfalama uygulanır

Her adım bir `computed` olarak yazılır ve bir öncekine bağlanır. Böylece sadece sayfa değiştiğinde filtreleme ve sıralama yeniden hesaplanmaz.

```typescript
// Derivation chain, each step memoized independently
const globallyFiltered = computed(() => {
  /* ... */
});
const columnFiltered = computed(() => {
  /* ... */
});
const sorted = computed(() => {
  /* ... */
});
const paginated = computed(() => {
  /* ... */
});
```

### 5.7 Sayfa indeksi davranışı

Filtre değiştiğinde sayfa indeksi sıfırlanmalıdır. Bunun için `linkedSignal` kullanılır, `effect` kullanılmaz.

```typescript
const pageIndex = linkedSignal<number, number>({
  source: () => columnFiltered().length,
  computation: () => 0,
});
```

### 5.8 Değişmezlik kuralları

1. Kaynak dizi asla değiştirilmez. Sıralamadan önce mutlaka kopya alınır.
2. `computed` içinde asla sinyal yazılmaz.
3. `effect` sadece gerçek yan etkiler için kullanılır. Durum senkronizasyonu için kullanılmaz.
4. Seçim durumu `Set` içinde tutulur ve her değişimde yeni bir `Set` üretilir.

### 5.9 Varsayılan karşılaştırıcı davranışı

Varsayılan `sortFn` şu kurallara uyar:

1. `null` ve `undefined` değerler her zaman sona yerleştirilir, sıralama yönünden bağımsız olarak.
2. Sayılar sayısal olarak karşılaştırılır.
3. Dizeler `localeCompare` ile karşılaştırılır, `sensitivity: 'base'` seçeneğiyle.
4. `Date` nesneleri zaman damgasına göre karşılaştırılır.
5. `boolean` değerlerde `false` önce gelir.
6. Tip uyuşmazlığında değerler dizeye çevrilip karşılaştırılır.

---

## 6. Bileşen Katmanı Tasarımı

### 6.1 Bileşen girdileri

```typescript
@Component({
  selector: 'ng-datatable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './datatable.html',
})
export class DataTable<T> {
  /** Provide either data + columns, or a pre-built table instance. */
  readonly data = input<readonly T[]>([]);
  readonly columns = input<readonly ColumnDef<T>[]>([]);
  readonly table = input<TableApi<T> | null>(null);

  readonly rowId = input<((row: T, index: number) => RowId) | undefined>();
  readonly pageSize = model<number>(10);
  readonly multiSort = input<boolean>(false);

  readonly loading = input<boolean>(false);
  readonly emptyMessage = input<string>('No data');

  readonly selectable = input<'none' | 'single' | 'multiple'>('none');
  readonly showPagination = input<boolean>(true);
  readonly showGlobalFilter = input<boolean>(false);

  readonly classNames = input<TableClassNames>({});

  /** Optional per-row class resolver. */
  readonly rowClass = input<((row: TableRow<T>) => string) | undefined>();

  // --- outputs ---
  readonly rowClick = output<TableRow<T>>();
  readonly selectionChange = output<readonly T[]>();
  readonly sortChange = output<readonly SortState[]>();
}
```

### 6.2 Örnek çözümleme mantığı

Bileşen, `table` girdisi verilmişse onu kullanır, verilmemişse kendisi oluşturur:

```typescript
protected readonly api: Signal<TableApi<T>> = computed(() => {
  const provided = this.table();
  if (provided) {
    return provided;
  }
  return this.internalTable;
});
```

`internalTable` bir kere oluşturulur ve `createTable` fonksiyonuna bir seçenek fonksiyonu verilir, böylece `data` ve `columns` girdileri değiştiğinde tablo reaktif olarak güncellenir.

### 6.3 Şablon özelleştirme

Kullanıcı `ng-template` ile hücre ve başlık şablonu verebilir. Yapı direktifi yerine içerik projeksiyonu kullanılır.

Kullanım şu şekilde olur:

```html
<ng-datatable [data]="people" [columns]="cols">
  <ng-template ngDataTableCell="email" let-value let-row="row">
    <a [href]="'mailto:' + value">{{ value }}</a>
  </ng-template>

  <ng-template ngDataTableHeader="email">
    <strong>E-posta</strong>
  </ng-template>

  <ng-template ngDataTableEmpty>
    <p>Kayıt bulunamadı.</p>
  </ng-template>
</ng-datatable>
```

Bunun için üç direktif yazılır: `NgDataTableCell`, `NgDataTableHeader`, `NgDataTableEmpty`. Her biri `TemplateRef` tutar ve `contentChildren` ile toplanır.

```typescript
readonly cellTemplates = contentChildren(NgDataTableCell);
```

Şablonda `ngTemplateOutlet` ile kullanılır. Eşleşen şablon yoksa varsayılan render devreye girer.

### 6.4 Parça listesi

Sınıf enjeksiyonu için tanımlı parçalar:

```typescript
export interface TableClassNames {
  readonly root?: string;
  readonly wrapper?: string;
  readonly toolbar?: string;
  readonly globalFilter?: string;
  readonly table?: string;
  readonly thead?: string;
  readonly headerRow?: string;
  readonly headerCell?: string;
  readonly sortIcon?: string;
  readonly columnFilter?: string;
  readonly tbody?: string;
  readonly row?: string;
  readonly cell?: string;
  readonly selectionCell?: string;
  readonly empty?: string;
  readonly loading?: string;
  readonly pagination?: string;
  readonly paginationButton?: string;
  readonly paginationInfo?: string;
}
```

### 6.5 Veri öznitelikleri

Her elemana durum bilgisi veri özniteliği olarak yazılır. Kullanıcı isterse sınıf yerine bunlara tutunabilir.

1. `data-sorted` — başlık hücresinde, değeri `asc`, `desc` veya yok
2. `data-sortable` — sıralanabilir başlıklarda
3. `data-selected` — seçili satırlarda
4. `data-row-index` — her satırda
5. `data-column-id` — her hücrede
6. `data-align` — hizalama değeri

---

## 7. Stil Katmanı

### 7.1 Dosya yapısı

Varsayılan stiller ayrı bir CSS dosyası olarak dağıtılır. Bileşenin kendi `styles` dizisi boştur.

Kullanıcı isterse içe aktarır:

```css
@import '@your-scope/datatable/styles.css';
```

İçe aktarmazsa tablo tamamen çıplak gelir.

### 7.2 Katman kullanımı

Bütün varsayılan stiller tek bir katmana alınır:

```css
@layer ng-datatable {
  .ngdt-table {
    /* ... */
  }
  .ngdt-header-cell {
    /* ... */
  }
}
```

Katman içindeki hiçbir kural birden fazla seçici kullanmaz ve hiçbirinde `!important` bulunmaz.

### 7.3 CSS değişkenleri

Tema için değişkenler tanımlanır. Kullanıcı sınıf ezmeden görünümü değiştirebilmelidir.

```css
@layer ng-datatable {
  .ngdt-root {
    --ngdt-border-color: #e2e8f0;
    --ngdt-header-bg: #f8fafc;
    --ngdt-row-hover-bg: #f1f5f9;
    --ngdt-selected-bg: #e0f2fe;
    --ngdt-row-height: 2.5rem;
    --ngdt-cell-padding-x: 0.75rem;
    --ngdt-cell-padding-y: 0.5rem;
    --ngdt-font-size: 0.875rem;
    --ngdt-radius: 0.375rem;
  }
}
```

### 7.4 Öncelik sırası

Bir hücreye üç kaynaktan stil gelebilir. Öncelik sırası şudur, düşükten yükseğe:

1. Varsayılan stil dosyası (katman içinde)
2. Kullanıcının kendi CSS'i (katman dışında)
3. `classNames` ile enjekte edilen sınıflar
4. `rowClass` fonksiyonundan dönen sınıflar

---

## 8. Erişilebilirlik Gereksinimleri

1. Kök eleman `<table>` etiketi kullanır. `<div>` ızgarası kullanılmaz.
2. Sıralanabilir başlık hücrelerinde `aria-sort` özniteliği bulunur. Değerleri `ascending`, `descending` veya `none`.
3. Sıralama tetikleyicisi `<th>` içinde bir `<button>` elemanıdır. `<th>` üzerine tıklama olayı bağlanmaz.
4. Satır seçimi onay kutusu (checkbox) ile yapılır ve `aria-label` içerir. Örnek: "Satır 3 seçili".
5. Tümünü seç onay kutusu, kısmi seçim durumunda `indeterminate` özelliğine sahiptir.
6. Sayfalama butonları `aria-label` içerir ve devre dışıyken `disabled` özniteliğine sahiptir.
7. Sayfa değiştiğinde veya filtre uygulandığında sonuç sayısı `aria-live="polite"` bölgesinde duyurulur.
8. Yükleniyor durumunda `aria-busy="true"` verilir.
9. Boş durum mesajı `<td>` içinde `colspan` ile tam genişlikte gösterilir.
10. Klavye ile tüm etkileşimli elemanlara `Tab` ile erişilebilir. Özel bir odak yönetimi kurulmaz, doğal sekme sırası yeterlidir.

---

## 9. Test Gereksinimleri

Test aracı Vitest kullanılır. Angular 21'den itibaren varsayılan test koşucusu budur.

### 9.1 Çekirdek testleri

Bunlar `TestBed` gerektirmez, saf birim testtir.

1. Boş veriyle tablo oluşturma
2. Tek sütun sıralama, üç durumlu döngü (artan, azalan, sırasız)
3. Çoklu sütun sıralama, sıra korunumu
4. `null` ve `undefined` değerlerin her iki yönde de sona gitmesi
5. Global filtre uygulaması
6. Sütun filtresi uygulaması
7. Global ve sütun filtresinin birlikte çalışması
8. Filtre değişince sayfa indeksinin sıfırlanması
9. Sayfa sınırlarının aşılamaması
10. Sayfa boyutu değişince sayfa sayısının yeniden hesaplanması
11. Satır seçiminin veri değişse de kimlik üzerinden korunması
12. Tümünü seç davranışının sadece mevcut sayfayı etkilemesi
13. Sütun görünürlüğü kapatıldığında o sütunun filtresinin de devre dışı kalması
14. Kaynak dizinin hiçbir işlemde değiştirilmediğinin doğrulanması
15. `computed` önbelleğinin çalıştığının doğrulanması: sadece sayfa değişince sıralama fonksiyonunun tekrar çağrılmaması

### 9.2 Bileşen testleri

1. Veri ve sütunlarla render edilmesi
2. Başlığa tıklayınca sıralamanın değişmesi
3. `classNames` değerlerinin doğru parçalara uygulanması
4. Özel hücre şablonunun varsayılanın yerine geçmesi
5. Boş durumda boş mesajının görünmesi
6. `aria-sort` özniteliğinin doğru değeri alması
7. Dışarıdan verilen `table` örneğinin kullanılması
8. Zonesiz ortamda güncellemelerin ekrana yansıması

Zonesiz test için `fixture.whenStable()` kullanılır, `fixture.detectChanges()` kullanılmaz.

---

## 10. npm Paketi Haline Getirme

Bu bölüm ilk npm paketini yayınlayacağın için adım adım ve eksiksiz yazılmıştır.

### 10.1 Ön hazırlık

1. Node.js sürümünü kontrol et: `node -v`. Angular 21 için en az Node 20.19 gerekir.
2. Angular CLI (Command Line Interface / Komut Satırı Arayüzü) kur veya güncelle: `npm install -g @angular/cli`
3. Sürümü doğrula: `ng version`

### 10.2 Çalışma alanı oluşturma

Kütüphane projeleri, uygulama içermeyen bir çalışma alanında yaşar. Demo uygulamasını sonra ekleyeceğiz.

1. Uygulamasız çalışma alanı oluştur: `ng new ngdt-workspace --no-create-application`
2. Klasöre gir: `cd ngdt-workspace`
3. Kütüphaneyi üret: `ng generate library ng-datatable`

Bu komut şunları yapar:

1. `projects/ng-datatable` klasörünü oluşturur
2. `projects/ng-datatable/package.json` dosyasını oluşturur
3. `projects/ng-datatable/ng-package.json` dosyasını oluşturur — bu, ng-packagr yapılandırmasıdır
4. `angular.json` dosyasına yeni projeyi ekler
5. Kök `tsconfig.json` dosyasına yol eşlemesi (path mapping) ekler

### 10.3 Demo uygulaması ekleme

Belgelendirme ve manuel test için gerekli.

1. `ng generate application demo`
2. Demo içinde kütüphaneyi yol eşlemesi üzerinden içe aktar: `import { DataTable } from 'ng-datatable';`

Yol eşlemesi sayesinde `npm link` kurmadan doğrudan kaynak koddan çalışır.

### 10.4 Paket adını belirleme

İki seçenek var:

1. **Kapsamsız ad:** `ng-datatable` gibi. npm üzerinde benzersiz olması gerekir, çoğu iyi ad alınmıştır.
2. **Kapsamlı ad:** `@guneralkim/ng-datatable` gibi. Kullanıcı adının altında olur, çakışma riski yoktur.

Kapsamlı adı öneriyorum. Kontrol için: `npm view @guneralkim/ng-datatable`. "404 Not Found" cevabı gelirse ad boştur.

### 10.5 Kütüphane package.json dosyasını yapılandırma

`projects/ng-datatable/package.json` dosyasını şu hale getir:

```json
{
  "name": "@guneralkim/ng-datatable",
  "version": "0.1.0",
  "description": "Signal-based, zoneless datatable for Angular 21+ with zero runtime dependencies",
  "keywords": ["angular", "datatable", "table", "data-grid", "signals", "zoneless", "headless"],
  "license": "MIT",
  "author": "Guner Kaan Alkim",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/KULLANICI_ADIN/ng-datatable.git"
  },
  "bugs": {
    "url": "https://github.com/KULLANICI_ADIN/ng-datatable/issues"
  },
  "homepage": "https://github.com/KULLANICI_ADIN/ng-datatable#readme",
  "peerDependencies": {
    "@angular/common": "^21.0.0 || ^22.0.0",
    "@angular/core": "^21.0.0 || ^22.0.0"
  },
  "sideEffects": false
}
```

Açıklamalar:

1. `peerDependencies` kritiktir. Angular'ı bağımlılık olarak koyarsan kullanıcının projesine ikinci bir Angular kopyası iner ve her şey bozulur. Eşdeğer bağımlılık, "kullanıcının projesinde zaten bulunmalı" demektir.
2. `dependencies` alanı hiç bulunmamalıdır. Sıfır bağımlılık sözümüz budur.
3. `sideEffects: false`, paket toplayıcıların (bundler) kullanılmayan kodu atmasını sağlar.
4. `version` alanını 0.1.0 ile başlat. 1.0.0'a ancak API'yi dondurmaya hazır olduğunda çık.
5. `main`, `module`, `types`, `exports` alanlarını sen yazmıyorsun. ng-packagr bunları derleme sırasında otomatik ekliyor.

### 10.6 İkinci giriş noktası oluşturma

`@guneralkim/ng-datatable/core` şeklinde ayrı içe aktarma için ikincil giriş noktası (secondary entry point) gerekir.

1. `projects/ng-datatable/core` klasörünü oluştur.
2. İçine `ng-package.json` dosyası koy:

```json
{
  "lib": {
    "entryFile": "src/public-api.ts"
  }
}
```

3. `projects/ng-datatable/core/src/public-api.ts` dosyasını oluştur ve çekirdek dışa aktarımlarını buraya koy.
4. Ana giriş noktasının `public-api.ts` dosyası da çekirdeği yeniden dışa aktarsın, böylece tek içe aktarmayla da erişilebilsin.

Bu yapı sayesinde kullanıcı iki şekilde de kullanabilir:

```typescript
import { createTable } from '@guneralkim/ng-datatable/core';
import { DataTable } from '@guneralkim/ng-datatable';
```

### 10.7 Stil dosyasını pakete dahil etme

CSS dosyası TypeScript derleyicisinden geçmez, elle kopyalanması gerekir.

1. Stil dosyasını `projects/ng-datatable/styles/datatable.css` yoluna koy.
2. `projects/ng-datatable/ng-package.json` dosyasına varlık kopyalama kuralı ekle:

```json
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/ng-datatable",
  "assets": ["./styles/**/*.css"],
  "lib": {
    "entryFile": "src/public-api.ts"
  }
}
```

3. Derlemeden sonra `dist/ng-datatable/styles/datatable.css` dosyasının oluştuğunu doğrula.

### 10.8 Dosyaları hazırlama

1. `projects/ng-datatable/README.md` dosyasını oluştur. npm sayfasında görünecek olan budur, kök dizindeki README değil.
2. `projects/ng-datatable/LICENSE` dosyasını oluştur. MIT lisans metnini https://opensource.org/license/mit adresinden al, yıl ve isim alanlarını doldur.
3. Kök dizinde `.npmignore` dosyasına ihtiyaç yok. ng-packagr sadece derleme çıktısını `dist` klasörüne koyar, o klasörü yayınlıyoruz.

### 10.9 Derleme

1. Kütüphaneyi derle: `ng build ng-datatable`
2. Çıktı `dist/ng-datatable` klasöründe oluşur.
3. Çıktının içeriğini kontrol et: `ls -R dist/ng-datatable`
4. Şunların var olduğunu doğrula: `package.json`, `README.md`, `LICENSE`, `index.d.ts`, `fesm2022` klasörü, `core` klasörü, `styles` klasörü.
5. Oluşan `package.json` dosyasını aç ve `exports` alanının hem `.` hem `./core` girişlerini içerdiğini doğrula.

### 10.10 Yayınlamadan önce yerel test

Bu adımı atlama. Paket yayınlandıktan sonra aynı sürüm numarasıyla düzeltme yapamazsın.

Yöntem 1 — paketleme ile test:

1. `cd dist/ng-datatable`
2. `npm pack`
3. Bu komut `guneralkim-ng-datatable-0.1.0.tgz` dosyası üretir.
4. Ayrı bir klasörde yeni bir Angular uygulaması oluştur: `ng new test-app`
5. Sıkıştırılmış dosyayı kur: `npm install /tam/yol/guneralkim-ng-datatable-0.1.0.tgz`
6. Bileşeni içe aktar ve çalıştığını doğrula.

Bu yöntem `npm link` yönteminden daha güvenilirdir, çünkü gerçek kurulum sürecini birebir taklit eder. `npm link` Angular projelerinde ikili Angular örneği hatasına yol açabilir.

Kontrol listesi:

1. Bileşen render ediliyor mu?
2. `@guneralkim/ng-datatable/core` içe aktarması çalışıyor mu?
3. Stil dosyası içe aktarılabiliyor mu?
4. TypeScript tip tamamlaması çalışıyor mu?
5. Derlemede uyarı var mı?

### 10.11 npm hesabı oluşturma

1. https://www.npmjs.com/signup adresinden hesap aç.
2. E-posta adresini doğrula. Doğrulanmamış hesap paket yayınlayamaz.
3. İki aşamalı doğrulamayı (2FA / Two-Factor Authentication / İki Faktörlü Kimlik Doğrulama) etkinleştir: https://www.npmjs.com/settings/~/profile — bu artık yayınlama için zorunludur.
4. Terminalden giriş yap: `npm login`
5. Girişi doğrula: `npm whoami`

### 10.12 İlk yayın

1. Derleme çıktısı klasörüne gir: `cd dist/ng-datatable`
2. Ne yayınlanacağını önce gör: `npm publish --dry-run`
3. Çıktıdaki dosya listesini oku. Beklemediğin bir dosya varsa dur ve düzelt.
4. Yayınla: `npm publish --access public`

Önemli: kapsamlı paketler (`@kullanici/paket` biçimindekiler) varsayılan olarak özel (private) kabul edilir ve ücretli plan ister. `--access public` bayrağı olmadan yayınlarsan hata alırsın.

5. Yayını doğrula: `npm view @guneralkim/ng-datatable`
6. Sayfayı ziyaret et: `https://www.npmjs.com/package/@guneralkim/ng-datatable`

### 10.13 Sürüm yönetimi

Anlamsal sürümleme (SemVer / Semantic Versioning) kurallarına uy:

1. Yama (patch), örneğin 0.1.0 → 0.1.1: sadece hata düzeltmesi.
2. Küçük (minor), örneğin 0.1.0 → 0.2.0: geriye uyumlu yeni özellik.
3. Büyük (major), örneğin 0.9.0 → 1.0.0: kırıcı değişiklik.

Sürüm numarasını elle değiştirme, komutla yükselt. Kütüphane klasöründe:

1. `cd projects/ng-datatable`
2. `npm version patch` veya `npm version minor`
3. Kök klasöre dön ve yeniden derle: `ng build ng-datatable`
4. `cd dist/ng-datatable && npm publish --access public`

Uyarı: 1.0.0 öncesinde (0.x sürümlerinde) SemVer kuralları gevşek kabul edilir, yani küçük sürüm artışında da kırıcı değişiklik yapabilirsin. Bu, API'yi olgunlaştırmak için sana alan tanır. 1.0.0'a çıkmak için acele etme.

### 10.14 Yanlış yayın durumunda ne yapılır

1. Yayından 72 saat geçmediyse geri çekebilirsin: `npm unpublish @guneralkim/ng-datatable@0.1.0`
2. 72 saat geçtiyse geri çekemezsin. Bunun yerine kullanımdan kaldırılmış olarak işaretle: `npm deprecate @guneralkim/ng-datatable@0.1.0 "Bu surumde hata var, 0.1.1 kullanin"`
3. Silinen sürüm numarası bir daha kullanılamaz. Doğrudan bir sonraki numaraya geç.

Bu yüzden 10.10 adımındaki yerel test kritiktir.

### 10.15 Otomatik yayın (isteğe bağlı, sonraya bırakılabilir)

GitHub Actions ile etiket (tag) atıldığında otomatik yayın kurabilirsin.

1. npm üzerinde otomasyon jetonu (automation token) oluştur: https://www.npmjs.com/settings/~/tokens — türü "Automation" olmalı, çünkü bu tür 2FA istemez.
2. Jetonu GitHub deposunda gizli değişken olarak sakla: depo ayarlarında Secrets and variables bölümüne `NPM_TOKEN` adıyla ekle.
3. `.github/workflows/publish.yml` dosyasını oluştur ve `npm publish --provenance --access public` komutunu çalıştır.

`--provenance` bayrağı, paketin hangi kaynak koddan ve hangi iş akışından üretildiğini kriptografik olarak kanıtlar. npm sayfasında doğrulanmış rozet gösterir. Yeni bir paket için güven sinyali olarak değerlidir.

---

## 11. Belgelendirme Gereksinimleri

### 11.1 README yapısı

Sıralama önemlidir. Yıldız, ilk ekranda kazanılır.

1. Paket adı ve tek cümlelik tanım
2. Rozetler: npm sürümü, paket boyutu, lisans
3. Demo GIF veya ekran görüntüsü — bu maddeyi atlama
4. Kurulum komutu
5. Otuz saniyede çalışan en küçük örnek
6. Özellik listesi, madde madde
7. Neden bu kütüphane bölümü: TanStack, AG Grid ve PrimeNG ile farkın
8. Özelleştirme örnekleri: `classNames` ve `ng-template` kullanımı
9. API referansı
10. Yol haritası — v1 dışında bıraktıklarını burada listele
11. Lisans

### 11.2 Demo sitesi

Yayın günü için hazır olmalı. GitHub Pages üzerinde barındır. En az dört örnek içersin:

1. Temel kullanım, hiç stil verilmeden
2. Varsayılan stille kullanım
3. Tailwind ile `classNames` üzerinden tamamen özelleştirilmiş görünüm
4. Sadece çekirdek API ile yazılmış tamamen özel tablo

Dördüncüsü özellikle önemli, çünkü iki katmanlı yapının değerini kanıtlayan tek şey odur.

---

## 12. Geliştirme Sırası

Kendin başlayıp Gemini ile devam edeceğin için sıra şöyle olmalı:

1. Çalışma alanını ve kütüphane iskeletini kur (bölüm 10.2 ve 10.3)
2. Tip tanımlarını yaz: `ColumnDef`, `TableOptions`, `TableApi`, `SortState` — bu adımı kendin yap, çünkü geri kalan her şey buna bağlı
3. `createTable` fabrikasını ve türetme zincirini yaz
4. Çekirdek birim testlerini yaz
5. Bileşenin iskeletini ve şablonunu yaz
6. Şablon direktiflerini ekle
7. Sınıf enjeksiyonunu ve veri özniteliklerini ekle
8. Erişilebilirlik özniteliklerini ekle
9. Varsayılan stil dosyasını yaz
10. Demo uygulamasını ve dört örneği hazırla
11. Bileşen testlerini yaz
12. README ve demo sitesini hazırla
13. Yerel test yap (bölüm 10.10)
14. 0.1.0 sürümünü yayınla

İkinci ve üçüncü adımları kendin yazman en doğrusu. API tasarımı geri dönüşü en pahalı karardır ve mimarinin tamamını belirler.

---

## 13. Yayın Günü Kontrol Listesi

1. README hazır ve içinde demo GIF var mı?
2. Demo sitesi yayında ve çalışıyor mu?
3. npm paketi yayınlandı ve temiz bir projede kurulup test edildi mi?
4. GitHub deposunda açıklama, konu etiketleri (topics) ve web sitesi bağlantısı dolduruldu mu?
5. Konu etiketleri eklendi mi: `angular`, `datatable`, `signals`, `zoneless`, `data-grid`
6. Lisans dosyası hem depoda hem pakette var mı?
7. Katkı rehberi (CONTRIBUTING.md) ve sorun şablonları eklendi mi?
