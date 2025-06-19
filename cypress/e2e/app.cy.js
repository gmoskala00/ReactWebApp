describe('ManagMe – testy E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.get('input[placeholder="Login"]').type('admin');
    cy.get('input[placeholder="Hasło"]').type('admin123');
    cy.contains('Zaloguj').click();
  });

  it('Tworzy nowy projekt', () => {
    cy.get('input[placeholder="Tytuł Projektu"]').type('Projekt testowy');
    cy.get('textarea[placeholder="Opis Projektu"]').type('Opis testowego projektu');
    cy.contains('Dodaj').click();
    cy.contains('Projekt testowy').should('exist');
  });

  it('Tworzy historyjkę i zadanie', () => {
    cy.contains('Projekt testowy').parent().find('.btn-info').click();
    cy.get('input[placeholder="Nazwa"]').type('Nowa historyjka');
    cy.get('textarea[placeholder="Opis"]').type('Opis historyjki');
    cy.get('[data-testid="story-add"]').click();
    cy.contains('Nowa historyjka').should('exist');

    cy.contains('Zadania').click();
    cy.contains('Dodaj zadanie').click();
    cy.get('[data-testid="task-name"]').type('Testowe zadanie');
    cy.get('[data-testid="task-description"]').type('Opis zadania');
    cy.get('select').eq(0).select('wysoki');
    cy.get('input[type="number"]').focus().type("{selectall}").type('5');
    cy.contains('Dodaj zadanie').click();
    cy.contains('Testowe zadanie').should('exist');
  });

  it('Akcje Zadania', () => {
    cy.contains('Projekt testowy').parent().find('.btn-info').click();
    cy.contains('Zadania').click();
    cy.contains('Testowe zadanie').click();
    cy.get('select').eq(1).select('done');
    cy.contains('Zamknij').click();
    cy.contains('Testowe zadanie')
      .parent()
      .should('contain.text', 'Zrobione');

    cy.contains('Testowe zadanie').click();
    cy.contains('Edytuj').click();
    cy.get('input[placeholder="Nazwa zadania"]').clear().type('Zadanie po edycji');
    cy.contains('Zapisz').click();
    cy.contains('Zadanie po edycji').should('exist');

    cy.contains('Edytuj').click();
    cy.contains('Usuń').click();
    cy.contains('Zadanie po edycji').should('not.exist');
  });

  it('Akcje historyjki', () => {
    cy.contains('Projekt testowy').parent().find('.btn-info').click();
    cy.contains('Nowa historyjka').parent().parent().find('.btn-warning').click();
    cy.get('[data-testid="story-edit-name"]').clear().type('Nowa historyjka po edycji');
    cy.get('[data-testid="story-edit-description"]').clear().type('Nowy opis');
    cy.contains('Zapisz').click();
    cy.contains('Nowa historyjka po edycji').should('exist');

    cy.contains('Nowa historyjka po edycji').parent().parent().find('.btn-danger').click();
    cy.contains('Nowa historyjka po edycji').should('not.exist');

  });

  it('Akcje projekt', () => {
    cy.contains('Projekt testowy').parent().find('.btn-warning').click();
    cy.get('[data-testid="project-edit-name"]').clear().type('Projekt po edycji');
    cy.get('[data-testid="project-edit-description"]').clear().type('Nowy opis projektu');
    cy.contains('Zapisz').click();
    cy.contains('Projekt po edycji').should('exist');

    cy.contains('Projekt po edycji').parent().find('.btn-danger').click();
    cy.contains('Projekt po edycji').should('not.exist');
  });
});
