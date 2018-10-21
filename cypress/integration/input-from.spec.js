describe('Input from ', () =>{

    beforeEach('it should visit the page',()=>{
        cy.visit("/")
    })
    it('focuses input on load ', ()=>{     
        cy.focused()
        .should('have.class','new-todo')     
    })

    it('accept input', ()=>{
        const typeTxt="Buy milk"
        cy.get(".new-todo").type(typeTxt)
        .should('have.value',typeTxt)    
    })

    context('From submission',()=>{
        beforeEach(()=>{
            cy.server()
        })
        it('Adds new todo on the list',()=>{
            const addItem = 'Buy Sugar'
            cy.route('POST','/api/todos',{
                name: addItem,
                id: '1',
                isComplete: false
            })
            cy.get('.new-todo').type(addItem)
            .type('{enter}')
            .should('have.value','')
            cy.get('.todo-list li')
            .should('have.length', 1)
            .and('contain',addItem)
        })
        it('should show the error message',()=>{
            cy.route({
                url: 'api/todos',
                method: 'POST',
                status: 500,
                response: {}
            })
            cy.get('.new-todo').type("test{enter}")
            cy.get('.todo-list li')
            .should('not.exist')
            cy.get('.error')
            .should('be.visible')
        })
    })
})