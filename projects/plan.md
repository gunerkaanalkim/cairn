# Cairn DataTable — Detaylı Geliştirme Planı

Bu doküman, PRD (Product Requirements Document / Ürün Gereksinim Dokümanı) bölüm 12'deki on dört adımlık geliştirme sırasını dosya ve klasör düzeyinde açar.

Paket adı: `@guneralkim/cairn-datatable`
Çalışma alanı kökü: `cairn-workspace/`
Kütüphane kökü: `cairn-workspace/projects/cairn-datatable/`
Demo kökü: `cairn-workspace/projects/cairn-demo/`

Tüm göreli yollar çalışma alanı kökünden verilmiştir.

---

## 0. Bitmiş hâlde klasör yapısı

Bu ağaç, on dördüncü adım tamamlandığında elinde olması gereken yapıdır. Aşağıdaki adımlarda hangi dosyayı ne zaman oluşturacağın tek tek yazılıdır.

```
cairn-workspace/
├── angular.json
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── publish.yml
│   │   └── deploy-demo.yml
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
└── projects/
    ├── cairn-datatable/
    │   ├── ng-package.json
    │   ├── package.json
    │   ├── README.md
    │   ├── LICENSE
    │   ├── tsconfig.lib.json
    │   ├── tsconfig.lib.prod.json
    │   ├── tsconfig.spec.json
    │   ├── core/
    │   │   ├── ng-package.json
    │   │   └── src/
    │   │       ├── public-api.ts
    │   │       ├── types.ts
    │   │       ├── defaults.ts
    │   │       ├── create-table.ts
    │   │       ├── create-table.spec.ts
    │   │       └── internal/
    │   │           ├── row-model.ts
    │   │           ├── row-model.spec.ts
    │   │           ├── filtering.ts
    │   │           ├── filtering.spec.ts
    │   │           ├── sorting.ts
    │   │           ├── sorting.spec.ts
    │   │           ├── pagination.ts
    │   │           ├── pagination.spec.ts
    │   │           ├── selection.ts
    │   │           └── selection.spec.ts
    │   ├── styles/
    │   │   └── cairn-datatable.css
    │   └── src/
    │       ├── public-api.ts
    │       └── lib/
    │           ├── data-table.ts
    │           ├── data-table.html
    │           ├── data-table.css
    │           ├── data-table.spec.ts
    │           ├── class-names.ts
    │           └── directives/
    │               ├── cell-template.ts
    │               ├── header-template.ts
    │               ├── empty-template.ts
    │               └── loading-template.ts
    └── cairn-demo/
        └── src/
            ├── styles.css
            └── app/
                ├── app.ts
                ├── app.html
                ├── app.routes.ts
                ├── shared/
                │   ├── sample-data.ts
                │   └── example-shell.ts
                └── examples/
                    ├── basic/
                    │   ├── basic-example.ts
                    │   └── basic-example.html
                    ├── styled/
                    │   ├── styled-example.ts
                    │   └── styled-example.html
                    ├── tailwind/
                    │   ├── tailwind-example.ts
                    │   └── tailwind-example.html
                    └── headless/
                        ├── headless-example.ts
                        └── headless-example.html
```

---

## Adım 1 — Çalışma alanı ve kütüphane iskeleti

Bu adım büyük ölçüde tamamlandı. Eksik kalanları kapat.

Oluşturulacak dosyalar:

1. `projects/cairn-datatable/core/ng-package.json` — ikincil giriş noktası tanımı. İçeriği sadece `{ "lib": { "entryFile": "src/public-api.ts" } }` olacak.
2. `projects/cairn-datatable/LICENSE` — MIT metni.
3. `projects/cairn-datatable/README.md` — şimdilik tek satır yer tutucu, adım 12'de doldurulacak.

Düzenlenecek dosyalar:

1. `cairn-workspace/tsconfig.json` — `paths` alanına `"@guneralkim/cairn-datatable/*": ["./dist/cairn-datatable/*"]` girişini ekle.
2. `projects/cairn-datatable/tsconfig.lib.json` — `compilerOptions` içine `"importHelpers": false` ekle, `tslib` bağımlılığını kaldırmak için.
3. `projects/cairn-datatable/package.json` — `repository` nesnesine `"directory": "projects/cairn-datatable"` ekle.
4. `projects/cairn-datatable/ng-package.json` — `assets` alanına `"./styles/**/*.css"` ekle. Klasör henüz boş olsa da şimdi ekle, adım 9'da doldurulacak.

Doğrulama komutu:

```bash
rm -rf dist && ng build cairn-datatable && ls dist/cairn-datatable
```

Tamamlanma ölçütü: `dist/cairn-datatable` içinde `core`, `fesm2022`, `types`, `LICENSE`, `README.md`, `package.json` bulunmalı ve `package.json` içinde `dependencies` alanı olmamalı.

---

## Adım 2 — Tip tanımları

Bu adım ayrı bir dokümanda tam olarak açıldı, burada sadece dosya listesi verilir.

Oluşturulacak dosyalar:

1. `projects/cairn-datatable/core/src/types.ts` — `RowId`, `SortDirection`, `ColumnAlign`, `Accessor`, `ColumnDef`, `Row`, `SortState`, `PaginationState`, `TableState`, `TableOptions`, `TableApi` tipleri.
2. `projects/cairn-datatable/core/src/defaults.ts` — `DEFAULT_PAGE_SIZE`, `DEFAULT_EMPTY_MESSAGE`, `DEFAULT_SORT_CYCLE` sabitleri.
3. `projects/cairn-datatable/core/src/public-api.ts` — yukarıdaki ikisinin dışa aktarımı.

Tamamlanma ölçütü: `npx tsc --noEmit -p projects/cairn-datatable/tsconfig.lib.json` komutu hatasız geçmeli.

---

## Adım 3 — createTable fabrikası ve türetme zinciri

Bu adım projenin kalbi. Tek dosyaya sıkıştırma, altı parçaya böl. Her parça saf fonksiyon olacak, sinyal bilmeyecek. Sinyal zincirini sadece `create-table.ts` kuracak.

### 3.1 Oluşturulacak yardımcı dosyalar

Hepsi `projects/cairn-datatable/core/src/internal/` klasöründe.

**Dosya 1: `row-model.ts`**

Ham veriyi `Row` nesnelerine çevirir. Dışa aktaracağı fonksiyon:

```typescript
export function buildRows<T>(
  data: readonly T[],
  rowId: (row: T, index: number) => RowId,
): readonly Row<T>[]
```

Kurallar: kaynak diziyi asla değiştirme, her satıra `sourceIndex` ata, `selected` alanını başlangıçta `false` bırak.

**Dosya 2: `filtering.ts`**

Dışa aktaracağı üç fonksiyon:

```typescript
export function readCellValue<T>(row: T, column: ColumnDef<T>): unknown
export function defaultFilterPredicate(value: unknown, query: string): boolean
export function applyFilters<T>(
  rows: readonly Row<T>[],
  columns: readonly ColumnDef<T>[],
  globalFilter: string,
  columnFilters: Readonly<Record<string, string>>,
  fallback: (value: unknown, query: string) => boolean,
): readonly Row<T>[]
```

Kritik kural: `applyFilters` fonksiyonuna sadece görünür sütunlar geçilecek. Gizli sütunun filtresi uygulanmamalı. PRD test maddesi 13 bunu doğruluyor.

**Dosya 3: `sorting.ts`**

Dışa aktaracağı iki fonksiyon:

```typescript
export function defaultComparator(a: unknown, b: unknown): number
export function applySorting<T>(
  rows: readonly Row<T>[],
  columns: readonly ColumnDef<T>[],
  sorting: readonly SortState[],
  fallback: (a: unknown, b: unknown) => number,
): readonly Row<T>[]
```

Kritik kurallar: `null` ve `undefined` değerler yönden bağımsız olarak sona gitmeli. Sıralama kararlı (stable) olmalı, `Array.prototype.sort` modern motorlarda kararlıdır ama kaynak diziyi değiştirir, bu yüzden önce kopyala. Çoklu sıralamada dizideki sıra öncelik demektir.

**Dosya 4: `pagination.ts`**

Dışa aktaracağı iki fonksiyon:

```typescript
export function clampPageIndex(pageIndex: number, pageCount: number): number
export function applyPagination<T>(
  rows: readonly Row<T>[],
  pagination: PaginationState,
): readonly Row<T>[]
```

Kritik kurallar: sayfa sayısı hiçbir zaman sıfır olmamalı, en az bir dönmeli. Sayfa indeksi sınır dışına çıkamamalı.

**Dosya 5: `selection.ts`**

Dışa aktaracağı üç fonksiyon:

```typescript
export function markSelected<T>(
  rows: readonly Row<T>[],
  selection: ReadonlySet<RowId>,
): readonly Row<T>[]
export function toggleId(selection: ReadonlySet<RowId>, id: RowId): ReadonlySet<RowId>
export function togglePageIds(
  selection: ReadonlySet<RowId>,
  pageIds: readonly RowId[],
): ReadonlySet<RowId>
```

Kritik kural: `togglePageIds` sadece verilen kimlikleri etkilemeli, diğer sayfalardaki seçim korunmalı.

### 3.2 Ana fabrika dosyası

**Dosya: `projects/cairn-datatable/core/src/create-table.ts`**

İçinde kuracağın sinyal zinciri şu sırada olmalı ve **her aşama ayrı bir `computed` olmalı**:

1. `baseRows` — `buildRows` çağrısı, `data` ve `rowId` bağımlı.
2. `visibleColumnList` — gizli sütunları eleyen hesaplama.
3. `filteredRows` — `applyFilters` çağrısı.
4. `sortedRows` — `applySorting` çağrısı.
5. `pageCount` — `filteredRows` uzunluğu ve sayfa boyutundan.
6. `pagedRows` — `applyPagination` çağrısı.
7. `rows` — `markSelected` çağrısı, dışarıya verilen son hâl.

Durum sinyalleri (`signal` ile, `computed` değil):

1. `sortingState`
2. `globalFilterState`
3. `columnFiltersState`
4. `paginationState`
5. `selectionState`
6. `hiddenColumnsState`

Yazma metotlarının hepsi bu altı sinyali günceller, başka hiçbir şeye dokunmaz.

Zincirin sırasını bozma. Sayfalamayı sıralamadan önce yaparsan tablo yanlış sonuç verir. Tek büyük `computed` yazarsan PRD test maddesi 15'i geçemezsin.

Filtre değiştiğinde sayfa indeksini sıfırlamak için `effect` kullanma. Bunun yerine `setGlobalFilter` ve `setColumnFilter` metotlarının içinde `paginationState` sinyalini elle sıfırla. Sebep: `effect` içinde sinyal yazmak Angular'da uyarı üretir ve zonesiz ortamda sıralama garantisi vermez.

### 3.3 Genel arayüzü güncelle

**Düzenlenecek dosya: `projects/cairn-datatable/core/src/public-api.ts`**

Şu satırı ekle: `export { createTable } from './create-table';`

`internal/` klasöründeki hiçbir dosyayı dışa aktarma. Onlar uygulama detayı, dışarı sızarsa ileride değiştiremezsin.

Tamamlanma ölçütü: `ng build cairn-datatable` hatasız geçmeli ve `dist/cairn-datatable/types/guneralkim-cairn-datatable-core.d.ts` dosyasında `internal` kelimesi geçmemeli.

---

## Adım 4 — Çekirdek birim testleri

Test dosyaları test edilen dosyanın yanında durur, ayrı bir `tests` klasörü açma.

Oluşturulacak dosyalar:

1. `projects/cairn-datatable/core/src/internal/row-model.spec.ts`
2. `projects/cairn-datatable/core/src/internal/filtering.spec.ts`
3. `projects/cairn-datatable/core/src/internal/sorting.spec.ts`
4. `projects/cairn-datatable/core/src/internal/pagination.spec.ts`
5. `projects/cairn-datatable/core/src/internal/selection.spec.ts`
6. `projects/cairn-datatable/core/src/create-table.spec.ts`

PRD bölüm 9.1'deki on beş maddeyi şöyle dağıt:

1. Maddeler 2, 3, 4 → `sorting.spec.ts`
2. Maddeler 5, 6, 7 → `filtering.spec.ts`
3. Maddeler 9, 10 → `pagination.spec.ts`
4. Maddeler 11, 12 → `selection.spec.ts`
5. Maddeler 1, 8, 13, 14, 15 → `create-table.spec.ts`

Onbeşinci madde özel dikkat ister. Sıralama fonksiyonunun kaç kez çağrıldığını saymak için sütun tanımına sayaç artıran bir `sortFn` ver, sonra sadece sayfa indeksini değiştir ve sayacın artmadığını doğrula.

Sinyal okuyan testlerde `TestBed` gerekmez, çünkü `computed` bağlamsız çalışır. Sadece `createTable` çağırıp sonucu oku.

Çalıştırma komutu: `ng test cairn-datatable`

Tamamlanma ölçütü: on beş maddenin hepsi geçmeli.

---

## Adım 5 — Bileşen iskeleti ve şablonu

Bu adım ayrı bir dokümanda tam olarak açıldı, burada dosya listesi verilir.

Silinecek dosyalar:

1. `projects/cairn-datatable/src/lib/cairn-datatable.ts`
2. `projects/cairn-datatable/src/lib/cairn-datatable.spec.ts`
3. `projects/cairn-datatable/src/lib/cairn-datatable.service.ts` (varsa)

Oluşturulacak dosyalar:

1. `projects/cairn-datatable/src/lib/data-table.ts` — `DataTable<T>` sınıfı.
2. `projects/cairn-datatable/src/lib/data-table.html` — şablon.
3. `projects/cairn-datatable/src/lib/data-table.css` — sadece `:host { display: block; }`.

Düzenlenecek dosya:

1. `projects/cairn-datatable/src/public-api.ts` — `export * from './lib/data-table';` ve `export * from '@guneralkim/cairn-datatable/core';`

Tamamlanma ölçütü: demo uygulamasında iki satırlı bir tablo görünmeli ve başlığa tıklayınca sıra değişmeli.

---

## Adım 6 — Şablon direktifleri

Amaç: kullanıcının hücre, başlık, boş durum ve yükleniyor durumu görünümlerini kendi HTML (HyperText Markup Language / Hiper Metin İşaretleme Dili) parçalarıyla değiştirebilmesi.

Oluşturulacak dosyalar, hepsi `projects/cairn-datatable/src/lib/directives/` klasöründe:

**Dosya 1: `cell-template.ts`**

```typescript
import { Directive, TemplateRef, inject, input } from '@angular/core';

export interface CellContext<T> {
  readonly $implicit: unknown;
  readonly row: T;
  readonly columnId: string;
}

@Directive({
  selector: '[cairnCell]',
})
export class CairnCell<T> {
  /** Column id this template overrides. Omit to override every column. */
  readonly cairnCell = input<string | undefined>(undefined);

  readonly templateRef = inject<TemplateRef<CellContext<T>>>(TemplateRef);

  /** Enables strict template type checking for the context object. */
  static ngTemplateContextGuard<T>(
    _dir: CairnCell<T>,
    _ctx: unknown,
  ): _ctx is CellContext<T> {
    return true;
  }
}
```

`ngTemplateContextGuard` satırını atlama. O olmadan kullanıcının şablonunda `row` nesnesi `any` tipinde gelir ve tip güvenliği sözünü tutamazsın.

**Dosya 2: `header-template.ts`** — aynı desen, seçici `[cairnHeader]`, bağlam `{ $implicit: ColumnDef<T> }`.

**Dosya 3: `empty-template.ts`** — seçici `[cairnEmpty]`, bağlam boş.

**Dosya 4: `loading-template.ts`** — seçici `[cairnLoading]`, bağlam boş.

Düzenlenecek dosyalar:

1. `projects/cairn-datatable/src/lib/data-table.ts` — dört direktifi `contentChildren` ve `contentChild` ile topla:

```typescript
protected readonly cellTemplates = contentChildren(CairnCell);
protected readonly headerTemplate = contentChild(CairnHeader);
protected readonly emptyTemplate = contentChild(CairnEmpty);
protected readonly loadingTemplate = contentChild(CairnLoading);
```

Ayrıca sütun kimliğine göre şablon bulan bir yardımcı ekle:

```typescript
protected cellTemplateFor(columnId: string): TemplateRef<CellContext<T>> | null
```

2. `projects/cairn-datatable/src/lib/data-table.html` — her hücrede önce özel şablon var mı diye bak, yoksa varsayılana düş:

```html
@if (cellTemplateFor(column.id); as tpl) {
  <ng-container
    *ngTemplateOutlet="tpl; context: cellContext(row, column)"
  />
} @else {
  {{ cellText(row, column) }}
}
```

`ngTemplateOutlet` kullanmak için bileşenin `imports` dizisine `NgTemplateOutlet` eklemen gerekir. Bu `@angular/common` paketinden gelir ve tek başına içe aktarılabilir, `CommonModule` tamamını almana gerek yok.

3. `projects/cairn-datatable/src/public-api.ts` — dört direktifi ve `CellContext` tipini dışa aktar. Kullanıcı bunları `imports` dizisine ekleyecek.

Tamamlanma ölçütü: demo uygulamasında bir sütunun hücresini özel şablonla değiştirdiğinde sadece o sütun değişmeli.

---

## Adım 7 — Sınıf enjeksiyonu ve veri öznitelikleri

Amaç: kullanıcının tablonun her parçasına kendi CSS (Cascading Style Sheets / Basamaklı Stil Şablonları) sınıflarını verebilmesi. Bu, kütüphanenin en önemli ayrışma noktası.

Oluşturulacak dosya:

**`projects/cairn-datatable/src/lib/class-names.ts`**

```typescript
export interface CairnClassNames {
  readonly root?: string;
  readonly table?: string;
  readonly thead?: string;
  readonly headerRow?: string;
  readonly headerCell?: string;
  readonly headerCellSorted?: string;
  readonly sortIcon?: string;
  readonly tbody?: string;
  readonly row?: string;
  readonly rowSelected?: string;
  readonly rowEven?: string;
  readonly rowOdd?: string;
  readonly cell?: string;
  readonly emptyRow?: string;
  readonly emptyCell?: string;
  readonly loadingRow?: string;
  readonly loadingCell?: string;
}
```

Düzenlenecek dosyalar:

1. `projects/cairn-datatable/src/lib/data-table.ts` — girdi ekle: `readonly classNames = input<CairnClassNames>({});`
2. `projects/cairn-datatable/src/lib/data-table.html` — her öğeye iki şey ekle, sabit sınıf ve kullanıcı sınıfı:

```html
<th
  class="cairn-header-cell"
  [class]="classNames().headerCell"
  [attr.data-column-id]="column.id"
  [attr.data-sorted]="ariaSort(column)"
>
```

3. `projects/cairn-datatable/src/public-api.ts` — `CairnClassNames` tipini dışa aktar.

İki kural:

1. Sabit `cairn-` önekli sınıfları asla kaldırma. Varsayılan stil dosyası onlara dayanacak.
2. Veri özniteliklerini (`data-column-id`, `data-sorted`, `data-selected`) her zaman yaz. Kullanıcı bunlarla saf CSS seçicisi yazabilir, sınıf vermeye gerek kalmaz.

Tamamlanma ölçütü: demo uygulamasında Tailwind sınıfları verildiğinde tablonun görünümü tamamen değişmeli ve kütüphanenin kendi stili hiçbir şeyi ezmemeli.

---

## Adım 8 — Erişilebilirlik

Amaç: klavye ile tam kullanım ve ekran okuyucu desteği. PRD'de pazarlık dışı olarak işaretlendi.

Düzenlenecek dosyalar:

1. `projects/cairn-datatable/src/lib/data-table.html`

Yapılacak beş değişiklik:

1. Başlık hücresindeki tıklamayı `<th>` üzerinden alıp içine koyduğun `<button type="button">` öğesine taşı. Böylece sekme ile odaklanabilir ve boşluk tuşuyla tetiklenir hâle gelir.
2. `<th>` öğesine `scope="col"` ve `[attr.aria-sort]` ekle. `aria-sort` sadece `ascending`, `descending` veya `none` değerlerini alabilir.
3. Seçim onay kutularına erişilebilir etiket ver: `[attr.aria-label]="'Select row ' + row.id"`.
4. Tabloya `<caption>` ekle ve girdiyle doldurulabilir yap: `readonly caption = input<string>('')`. Boşsa `<caption>` öğesini hiç render etme.
5. Yükleniyor durumunda tablo gövdesine `aria-busy="true"` ekle.

2. `projects/cairn-datatable/src/lib/data-table.ts`

Klavye gezinme metodu ekle:

```typescript
protected onHeaderKeydown(event: KeyboardEvent, column: ColumnDef<T>): void
```

Desteklenecek tuşlar: `Enter` ve `Space` sıralamayı değiştirir, `Escape` sıralamayı temizler.

Tamamlanma ölçütü: fareyi hiç kullanmadan sekme ile tüm başlıklara ulaşıp sıralama yapabilmelisin.

---

## Adım 9 — Varsayılan stil dosyası

Oluşturulacak dosya:

**`projects/cairn-datatable/styles/cairn-datatable.css`**

Yazım kuralları:

1. Tüm kurallar `@layer cairn { ... }` bloğunun içine alınacak. Bu sayede kullanıcının kendi stilleri, özgüllük savaşına girmeden kütüphane stillerini ezer.
2. Renkler doğrudan yazılmayacak, özel özellik (custom property) üzerinden verilecek:

```css
@layer cairn {
  .cairn-table {
    --cairn-border: #e5e7eb;
    --cairn-header-bg: #f9fafb;
    --cairn-row-hover: #f3f4f6;
    --cairn-text: #111827;

    width: 100%;
    border-collapse: collapse;
    color: var(--cairn-text);
  }
}
```

3. Karanlık tema için `@media (prefers-color-scheme: dark)` bloğu ekle, sadece özel özellikleri değiştir.
4. Hiçbir yazı tipi ailesi tanımlama. Uygulamanınkini miras alsın.

Düzenlenecek dosyalar:

1. `projects/cairn-datatable/ng-package.json` — `"assets": ["./styles/**/*.css"]` girişinin var olduğunu doğrula.
2. `projects/cairn-datatable/package.json` — `sideEffects` alanını `false` yerine `["**/*.css"]` yap. Bunu yapmazsan bazı paketleyiciler stil dosyasını çıktıdan siler.

Kullanıcının içe aktarma biçimi şu olacak, README'de böyle yaz:

```css
@import '@guneralkim/cairn-datatable/styles/cairn-datatable.css';
```

Tamamlanma ölçütü: derlemeden sonra `dist/cairn-datatable/styles/cairn-datatable.css` dosyası oluşmalı.

---

## Adım 10 — Demo uygulaması ve dört örnek

Oluşturulacak paylaşılan dosyalar:

1. `projects/cairn-demo/src/app/shared/sample-data.ts` — en az elli satırlık örnek veri ve sütun tanımları. Sayfalamanın görünmesi için elli satır şart, üç satırla sayfalama örneği gösteremezsin.
2. `projects/cairn-demo/src/app/shared/example-shell.ts` — her örneğin etrafını saran, başlık ve kaynak kod gösteren kabuk bileşen.

Oluşturulacak örnek dosyaları:

1. `projects/cairn-demo/src/app/examples/basic/basic-example.ts` ve `.html` — hiç stil verilmeden, çıplak kullanım.
2. `projects/cairn-demo/src/app/examples/styled/styled-example.ts` ve `.html` — varsayılan stil dosyası içe aktarılmış hâli.
3. `projects/cairn-demo/src/app/examples/tailwind/tailwind-example.ts` ve `.html` — `classNames` girdisiyle tamamen Tailwind sınıflarıyla giydirilmiş hâli.
4. `projects/cairn-demo/src/app/examples/headless/headless-example.ts` ve `.html` — bileşen hiç kullanılmadan, sadece `createTable` ile yazılmış tamamen özel tablo.

Dördüncü örnek en önemlisi. İki katmanlı mimarinin değerini kanıtlayan tek şey o. Atlamayı düşünme.

Düzenlenecek dosyalar:

1. `projects/cairn-demo/src/app/app.routes.ts` — dört örneğe yönlendirme tanımla.
2. `projects/cairn-demo/src/app/app.html` — örnekler arasında gezinme bağlantıları.
3. `projects/cairn-demo/src/styles.css` — Tailwind yönergelerini ve kütüphane stil içe aktarmasını ekle.

Tamamlanma ölçütü: `ng serve cairn-demo` ile dört örneğin dördü de çalışmalı.

---

## Adım 11 — Bileşen testleri

Oluşturulacak dosya:

**`projects/cairn-datatable/src/lib/data-table.spec.ts`**

PRD bölüm 9.2'deki sekiz maddeyi bu tek dosyada topla. Bileşen testleri çekirdek testlerinden farklı olarak `TestBed` gerektirir.

Zonesiz test için kritik kural: `fixture.detectChanges()` kullanma, `await fixture.whenStable()` kullan. Test kurulumunda zonesiz sağlayıcıyı ekle:

```typescript
TestBed.configureTestingModule({
  imports: [DataTable],
  providers: [provideZonelessChangeDetection()],
});
```

Bu satırı unutursan testler geçer ama gerçek zonesiz uygulamada bileşen çalışmaz. Yanlış güven vermiş olursun.

Tamamlanma ölçütü: `ng test cairn-datatable` komutunda toplam yirmi üç test geçmeli.

---

## Adım 12 — README ve demo sitesi

Oluşturulacak veya düzenlenecek dosyalar:

1. `projects/cairn-datatable/README.md` — npm paket sayfasında görünen dosya budur. PRD bölüm 11.1'deki on bir maddelik sırayı birebir uygula.
2. `cairn-workspace/README.md` — depo kökündeki dosya. Bu, tüm `cairn` ailesini tanıtır, tek bir paketi değil. Her pakete bir satır açıklama ve bağlantı ver.
3. `cairn-workspace/CONTRIBUTING.md` — katkı rehberi.
4. `cairn-workspace/.github/ISSUE_TEMPLATE/bug_report.md` ve `feature_request.md` — sorun şablonları.
5. `cairn-workspace/.github/workflows/deploy-demo.yml` — demo sitesini GitHub Pages üzerine yayınlayan iş akışı.

README için üç uyarı:

1. Demo GIF veya ekran görüntüsünü atlama. Yıldız ilk ekranda kazanılıyor.
2. Kurulum komutundan sonraki ilk örnek en fazla on beş satır olsun. Uzun örnek okuyucuyu kaçırır.
3. Yol haritası bölümünde v1 dışında bıraktıklarını açıkça listele. Eksiklik gibi değil, bilinçli kapsam gibi görünür.

Demo sitesi yayını için `ng build cairn-demo --base-href /cairn/` komutunu kullan. Depo adı `cairn` olduğu için temel yol bu olmalı, yoksa varlıklar yüklenmez.

---

## Adım 13 — Yayın öncesi yerel test

Bu adım çalışma alanının **dışında** yapılır. `npm link` kullanma, Angular projelerinde ikili örnek hatası üretir.

Sıra:

1. `ng build cairn-datatable`
2. `cd dist/cairn-datatable`
3. `npm pack` — bu komut `guneralkim-cairn-datatable-0.1.0.tgz` dosyası üretir.
4. Tamamen ayrı bir klasöre çık: `cd ~/Documents/Development`
5. `ng new cairn-smoke-test --style=css`
6. `cd cairn-smoke-test`
7. `npm install ~/Documents/Development/cairn-workspace/dist/cairn-datatable/guneralkim-cairn-datatable-0.1.0.tgz`
8. Bileşeni içe aktar, basit bir tablo yaz, `ng serve` ile çalıştır.

Kontrol listesi:

1. Bileşen render ediliyor mu?
2. `@guneralkim/cairn-datatable/core` içe aktarması çalışıyor mu?
3. Stil dosyası `@import` ile yüklenebiliyor mu?
4. Tip tamamlaması çalışıyor mu?
5. Derlemede uyarı var mı?
6. `node_modules` içinde `tslib` kurulmuş mu? Kurulmuşsa `importHelpers` ayarı çalışmamış demektir.

Bu test klasörünü sonradan sil, deponun içine koyma.

---

## Adım 14 — 0.1.0 sürümünü yayınlama

Ön koşullar:

1. npm hesabı açılmış ve e-posta doğrulanmış olmalı.
2. İki aşamalı doğrulama (2FA / Two-Factor Authentication / İki Faktörlü Kimlik Doğrulama) etkin olmalı.
3. `npm login` yapılmış olmalı, `npm whoami` doğru kullanıcıyı göstermeli.

Sıra:

1. `projects/cairn-datatable/package.json` dosyasında sürümü `0.1.0` yap.
2. `ng build cairn-datatable`
3. `cd dist/cairn-datatable`
4. `npm publish --dry-run` — çıktıdaki dosya listesini satır satır oku. Beklemediğin bir dosya varsa dur.
5. `npm publish --access public`

`--access public` bayrağı zorunludur. Kapsamlı paketler varsayılan olarak özel kabul edilir ve ücretli plan ister.

Yayın sonrası doğrulama:

1. `npm view @guneralkim/cairn-datatable`
2. `https://www.npmjs.com/package/@guneralkim/cairn-datatable` sayfasını aç, README ve lisansın göründüğünü doğrula.

Otomatik yayın kurmak istersen oluşturulacak dosya:

**`cairn-workspace/.github/workflows/publish.yml`**

İçinde `npm publish --provenance --access public` komutu çalışacak. `NPM_TOKEN` gizli değişkenini depo ayarlarından ekle, jeton türü Automation olmalı çünkü o tür iki aşamalı doğrulama istemez.

---

## Ek: Gemini'ye devrederken vereceğin talimatlar

Kod üretimini devrettiğinde şu altı kuralı açıkça yaz, yoksa dosya yapısını bozar:

1. Dosya adlarında `.component.ts` ve `.service.ts` son ekleri kullanılmayacak. Angular 20 stil rehberi bunları kaldırdı.
2. Kod içindeki yorum satırları İngilizce yazılacak.
3. `*ngIf` ve `*ngFor` kullanılmayacak, yerleşik akış denetimi (`@if`, `@for`) kullanılacak.
4. `CommonModule` içe aktarılmayacak, gereken direktifler tek tek alınacak.
5. Hiçbir dosyada `zone.js` referansı olmayacak.
6. `internal/` klasöründeki hiçbir sembol genel arayüzden dışa aktarılmayacak.