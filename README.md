# HomeAssignment

## Description
A fun Angular home assignment challenge :D 

## Table of Contents
1. [Local development](#local-development)
2. [t-column](#t-column)
3. [t-grid](#t-grid)
4. [t-progress](#t-progress)
5. [Local testing](#local-testing)
6. [Important notes](#important-notes)

## Local development
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.5.

There are two ways of running this project locally:
1. Run `npm start` or `ng serve` in the root of the project to open a local development server.
2. Run `npm run storybook` or `ng run home-assignment:storybook` in the root of the project to open the [Storybook](https://storybook.js.org/).

## t-column
### Description
`t-column` is a helper-component meant to be used within the context of `t-grid`. It takes in some properties to help `t-grid` determine which columns should be rendered and if those columns are sortable or not.
### Inputs
`t-column` takes the following inputs:
```
  @Input() name: string;
  @Input() property: keyof T;
  @Input() sortable: boolean;
```
`name` represents the title of the column to be displayed in a `<th>` tag within `<thead>`

`property` represents a key within the `data` input of `t-grid` indicating which property of the data to be displayed on that specific column.

`sortable` represents the ability to have that column as a sorting criteria.
## t-grid
### Description
`t-grid` is a component representing a table to visualize data. It works together with the `t-column` to define which fields within the passed in data to display.
### Features
`t-grid` offers the following features:
1. Table data visualization
2. Pagination
3. Page size selection
4. Sortable headers
5. `OnPush` change detection strategy
6. Virtualization (implemented using `CdkVirtualScrollViewport` from `@angular/cdk/scrolling`)
### Inputs
`t-grid` takes the following inputs:
```
  @Input() data: T[] | Observable<T[]>;
  @Input() sortable: boolean;
  @Input() pageSize: number | null;
```
`data` represents the data to be visualized within the table. You can pass in an array directly or an observable. By taking the observable approach, all controls are disabled unitl the data is fully loaded into the table (check [Important notes](#important-notes)).

`sortable` represents the ability to sort the data within the table. If `true`, we can sort via any column criteria that also has `sortable: true`. If `false`, we can't sort anything.

`pageSize` represents the size of a page. In case of `null`, we do not use pagination, just scrolling.
### Outputs
`t-grid` takes the following outputs:
```
  @Output() sortChange = new EventEmitter<SortChangeEvent>();
  @Output() paginationChange = new EventEmitter<PaginationChangeEvent>();
```
Where:
```
export enum Direction {
  NONE = 'none',
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export type SortChangeEvent = {
  columnName: string;
  direction: Direction;
};

export type PaginationChangeEvent = {
  currentPage: number;
  pageSize: number | null;
};
```
`sortChange` is an `EventEmitter` that emits events whenever there is a sort related change (change of direction or change of sorting criteria).

`paginationChange` is an `EventEmitter` that emits events whenever there is a pagination related change (change of page number or page size).

Notes:
1. Any sort change resets the `currentPage` to `1` (`paginationChange` does not emit a new event if we already are on the first page)
2. Any page size change resets the `currentPage` to `1` (`paginationChange` does not emit a new event if we already are on the first page)

### Usage example
```
<t-grid 
  [data]="data" 
  [sortable]="sortable" 
  [pageSize]="pageSize" 
  (sortChange)="handleSortChange($event)" 
  (paginationChange)="handlePaginationChange($event)"
>
  <t-column [name]="'ID'" [property]="'id'" [sortable]="false"></t-column>
  <t-column [name]="'First Name'" [property]="'firstName'" [sortable]="true"></t-column>
  <t-column [name]="'Last Name'" [property]="'lastName'" [sortable]="true"></t-column>
  <t-column [name]="'Points'" [property]="'points'" [sortable]="true"></t-column>
  <t-column [name]="'Phone Number'" [property]="'phoneNumber'" [sortable]="false"></t-column>
</t-grid>
```

## t-progress
### Description
`t-progress` is a SVG based component that visually indicates a progress in the shape of a circle arc. The circle arc is filled proportionally to the progress indicated. It also provides a text.
### Inputs
`t-progress` takes in the following inputs:
```
  @Input() radius: number;
  @Input() progress: number;
  @Input() color: string;
```
`radius` represents the radius of the SVG circle. It must have a minimum value of `50`. In case the input provided is lower, it will default to `50`.

`progress` represents the progress indicated by the circle arc fill and text. It must be a value between [0, 100]. In case the value is negative, it will default to `0`. In case the value is aboove `100`, it will default to `100`.

`color` represents the color of the SVG circle and text.

### Outputs
`t-progress` has the following outputs:
```
@Output() complete = new EventEmitter<void>();
```
`complete` is an `EventEmitter` that emits an event whenever the `progress` input reaches the value of `100`.

### Usage example
```
      <t-progress 
        [radius]="radius" 
        [progress]="progress" 
        [color]="color"
        (complete)="logEvent()"
      >
      </t-progress>
```
## Local testing
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
## Important notes
Here are a few important notes:
1. In the case of `t-grid`, if the `data` input is an instance of `Observable` I decided to disable all inputs until the `complete` methods on the subscriber executes. The reason for this is to avoid certain unwanted scenarios in terms of user experience. Let's imagine that we have an observable that pipes in chunks of data every 5 seconds. Let's assume that in the time between the arrival of data chunks the user is already on page 3 and has a sorting criteria selected. Now a chunk of new data comes in. What should happen here? Should the user be redirected to page 1? Should we just inject the data and keep the current page? Both seem odd to me, so I decided it might be more natural to just wait for it to fully load
2. If you are running `t-grid` in the storybook, you might notice that changing the `data` field from the storybook controls does not work. To see the changes, you must reload the component (there is a reload button on top left of the story iframe). This is probably because of the `OnPush` change detection strategy. There is a possibility that storybook has some internal mechanisms to modify that `data` and it keeps the same reference? I am not entirely sure.

