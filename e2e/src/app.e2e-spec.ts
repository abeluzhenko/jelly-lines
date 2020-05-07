import { AppPage } from './app.po';
import { $ } from 'protractor';

describe('App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();

    page.navigateTo();
  });

  it('should create app', () => {
    expect($('app-game').getText()).toBeTruthy();
  });
});
