import { Subject, OperatorFunction, Observable } from 'rxjs';

export function doWhile<T>(
  enter$: Subject<T>,
  conditionFn: (value: T) => boolean,
  loop: OperatorFunction<T, T>
): Observable<T> {
  const exit$ = new Subject<T>();
  const loop$ = enter$.pipe(loop);
  loop$.subscribe(value => {
    if (conditionFn(value)) {
      enter$.next(value);
      return;
    }
    exit$.next(value);
  });
  return exit$.asObservable();
}
