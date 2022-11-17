describe('empty spec', () => {
  // Before each test we need to restore local storage to preserve it.
  beforeEach(() => {
    cy.restoreLocalStorage()
  })
  // After each test we save local storage.
  afterEach(() => {
    cy.saveLocalStorage()
  })
  // Before the actual path, we will need to register a another user to
  // create a listing for user to book

  // .1 register another user
  // .2 create, publish booking
  it('should navigate to landing page successfully on another user', () => {
    cy.wait(2000)
    cy.visit('localhost:3000/')
    cy.url().should('include', 'localhost:3000')
  })

  it('should navigate to register screen successfully on another user', () => {
    cy.get('button[name="registerButton"').click()
    cy.url().should('include', 'localhost:3000/register')
  })

  it('should register successfully on another user', () => {
    cy.get('input[name="email"]').focus().type('helpuser@gmail.com')
    cy.get('input[name="name"]').focus().type('helpuser')
    cy.get('input[name="password"]').focus().type('helpuser')
    cy.get('input[name="confirmPassword"]').focus().type('helpuser')
    cy.get('button[name="submit"]').click()

    cy.url().should('include', 'localhost:3000/HostedListings')
    cy.get('#sideButton').should('be.visible')
  })

  it('should open up listing screen successfully on another user', () => {
    cy.wait(2000)
    cy.get('button[name="createListing"]').click()
    cy.get('div[name="createANewlisting"]').should(
      'have.text',
      'Create a new listing'
    )
  })

  it('should create a listing successfully on another user', () => {
    cy.get('input[name="title"]').focus().type('listing 1')
    cy.get('input[name="address"]').focus().type('address')
    cy.get('input[name="city"]').focus().type('city')
    cy.get('input[name="state"]').focus().type('state')
    cy.get('input[name="postcode"]').focus().type(5555)
    cy.get('input[name="country"]').focus().type('MakkaPakka')
    cy.get('#PropertyType')
      .parent()
      .click()
      .get('ul > li[data-value="Room"')
      .click()
    cy.get('input[name="price"]').focus().type(1000)
    cy.get('input[name="bathrooms"]').focus().type(1)
    cy.get('textarea[name="amenities"]').focus().type('nope')
    cy.get('input[name="roomType"]').focus().type('study')
    cy.get('input[name="beds"]').focus().clear().type(1)

    cy.wait(6000)
    cy.get('button[name="submit"]').click()
    cy.wait(6000)
    cy.url().should('include', 'localhost:3000/HostedListings')
    cy.contains('listing 1')
  })

  it('should open listing availability successfully on main user', () => {
    cy.get('button[name="publish"]').click()

    cy.get('h2[name="availabilityTitle"]').should(
      'have.text',
      'Set availability'
    )
  })

  it('should set availability successfully on another user', () => {
    // Code to click the date button to open the date picker.
    // Then it clicks the "next month" button to go to the next month on the end date
    // Then it will select the number that is on the third row first column
    cy.contains('label', 'End Date')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get('#' + id)
      })
      .should(
        'have.attr',
        'class',
        'MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd css-nxo287-MuiInputBase-input-MuiOutlinedInput-input'
      )
      .next()
      .should(
        'have.attr',
        'class',
        'MuiInputAdornment-root MuiInputAdornment-positionEnd MuiInputAdornment-outlined MuiInputAdornment-sizeMedium css-1laqsz7-MuiInputAdornment-root'
      )
      .children('.MuiIconButton-root')
      .should('have.length', 1)
      .click()
      .get('.MuiPickersArrowSwitcher-root')
      .should(
        'have.attr',
        'class',
        'MuiPickersArrowSwitcher-root css-9reuh9-MuiPickersArrowSwitcher-root'
      )
      .children('.MuiIconButton-root')
      .should('have.length', 2)
      .eq(1)
      .click({ force: true })
      .get('.MuiDayPicker-monthContainer')
      .should(
        'have.attr',
        'class',
        'MuiDayPicker-monthContainer css-6t5f1e-MuiDayPicker-monthContainer'
      )
      .children('.MuiDayPicker-weekContainer')
      .eq(2)
      .should(
        'have.attr',
        'class',
        'MuiDayPicker-weekContainer css-ghi3gg-MuiDayPicker-weekContainer'
      )
      .children()
      .eq(0)
      .click({ force: true })

    cy.get('button[name="submit"]').click()

    cy.wait(2000)
    // Publish button should not exist
    cy.get('button[name="publish"]').should('not.exist')

    // Unpublish should now exist
    cy.get('button[name="unpublish"]').should('be.visible')
  })

  it('should logout successfully on another user', () => {
    cy.get('#sideButton').click()
    cy.get('#logoutButton').click()

    cy.wait(2000)
    // Should be back to landing page
    cy.url().should('include', 'localhost:3000')
    // The menu icon should also not exist anymore.
    cy.get('#sideButton').should('not.exist')
  })

  // register and login the main user
  // 1. Login to application successfully
  // 2. Creates a new listing using JSON file successfully
  // 3. Updates the thumbnail to video URL of the listing successfully
  // 4. Publish a listing successfully
  // Now we begin the happy path
  it('should navigate to register screen successfully', () => {
    cy.get('button[name="registerButton"').click()
    cy.url().should('include', 'localhost:3000/register')
  })

  it('should register successfully', () => {
    cy.get('input[name="email"]').focus().type('mainuser@gmail.com')
    cy.get('input[name="name"]').focus().type('mainuser')
    cy.get('input[name="password"]').focus().type('mainuser')
    cy.get('input[name="confirmPassword"]').focus().type('mainuser')
    cy.get('button[name="submit"]').click()

    // Should be on hosted listings page.
    cy.url().should('include', 'localhost:3000/HostedListings')
    // There should be a menu button top right.
    cy.get('#sideButton').should('be.visible')
  })

  it('should open up upload listing screen successfully', () => {
    cy.wait(2000)
    cy.get('button[name="uploadListing"]').click()
    cy.get('div[name="uploadListingTitle"]').should(
      'have.text',
      'Upload a new listing:'
    )
  })

  it('should create listing using JSON file successfully', () => {
    cy.wait(2000)
    cy.get('input[name="uploadListingFile"]').selectFile('src/assets/2.6.json')
    cy.get('button[name="uploadListingSubmit"]').click()
  })

  it('should open listing edit successfully', () => {
    cy.get('.MuiCardActionArea-root').click()

    cy.url().should('include', '/edit')
  })

  it('should update listing thumbnail to video successfully', () => {
    cy.wait(2000)
    cy.get('input[name="title"]').focus().clear().type('Makka Pakka Land')
    cy.get('#selectThumbnailType').click()

    cy.wait(1000)
    cy.get('#thumbnailUploadVideo').should('be.visible')
    cy.get('#thumbnailUploadVideo').type('https://youtu.be/ZNnBqclN4IM')

    cy.get('button[name="submit"]').click()

    cy.wait(3000)
    cy.url().should('include', 'localhost:3000/HostedListings')
    cy.contains('Makka Pakka Land')
  })

  it('should open listing availability successfully on main user', () => {
    cy.get('button[name="publish"]').click()

    cy.get('h2[name="availabilityTitle"]').should(
      'have.text',
      'Set availability'
    )
  })

  it('should set availability successfully on main user', () => {
    // Code to click the date button to open the date picker.
    // Then it clicks the "next month" button to go to the next month on the end date
    // Then it will select the number that is on the third row first column
    cy.contains('label', 'End Date')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get('#' + id)
      })
      .next()
      .children('.MuiIconButton-root')
      .should('have.length', 1)
      .click()
      .get('.MuiPickersArrowSwitcher-root')
      .children('.MuiIconButton-root')
      .should('have.length', 2)
      .eq(1)
      .click({ force: true })
      .get('.MuiDayPicker-monthContainer')
      .children('.MuiDayPicker-weekContainer')
      .eq(2)
      .children()
      .eq(0)
      .click({ force: true })

    cy.get('button[name="submit"]').click()

    cy.wait(2000)
    // Publish button should not exist
    cy.get('button[name="publish"]').should('not.exist')

    // Unpublish should now exist
    cy.get('button[name="unpublish"]').should('be.visible')
  })

  // navigate to landing page
  it('should navigate to landing page successfully', () => {
    cy.get('#goHomeButton').click()
    cy.url().should('include', 'localhost:3000')
  })

  // Search for listings by title names successfully
  it('should search for a listing successfully', () => {
    cy.wait(2000)
    cy.get('input[name="searchBox"]').focus().type('listing')
    cy.get('button[name="searchBoxAction"]').click()
    cy.get('.MuiCardActionArea-root').should('have.length', 1)
  })

  it('should open listing info successfully', () => {
    cy.get('.MuiCardActionArea-root').click()

    cy.url().should('include', '/listings')
    cy.contains('listing 1')
  })

  // book listing 1
  it('should make booking successfully', () => {
    cy.contains('label', 'CHECK IN')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get('#' + id)
      })
      .next()
      .children('.MuiIconButton-root')
      .should('have.length', 1)
      .click()
      .get('.MuiPickersDay-today')
      .click({ force: true })

    cy.contains('label', 'CHECK OUT')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get('#' + id)
      })
      .next()
      .children('.MuiIconButton-root')
      .should('have.length', 1)
      .click()
      .get('.MuiPickersDay-today')
      .next()
      .click({ force: true, multiple: true })

    // Choose number on second row first column
    cy.contains('label', 'CHECK OUT')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get('#' + id)
      })
      .next()
      .children('.MuiIconButton-root')
      .should('have.length', 1)
      .click()
      .get('.MuiPickersArrowSwitcher-root')
      .children('.MuiIconButton-root')
      .should('have.length', 2)
      .eq(1)
      .click({ force: true })
      .get('.MuiDayPicker-monthContainer')
      .children('.MuiDayPicker-weekContainer')
      .eq(1)
      .children()
      .eq(0)
      .click({ force: true })

    cy.get('button[name="submit"]').click()

    cy.wait(2000)
  })

  // logout
  it('should logout successfully', () => {
    cy.get('#sideButton').click()
    cy.get('#logoutButton').click()

    cy.wait(2000)
    // Should be back to landing page
    cy.url().should('include', 'localhost:3000')
    // The menu icon should also not exist anymore.
    cy.get('#sideButton').should('not.exist')
  })

  // login to helpuser
  it('should login to helper user and accept review successfully', () => {
    cy.get('button[name="signInButton"').click()
    cy.url().should('include', 'localhost:3000/login')
    cy.get('#email').focus().type('helpuser@gmail.com')
    cy.get('#password').focus().type('helpuser')

    cy.get('button[name="submit"]').click()

    // Should be on hosted listings page
    cy.url().should('include', 'localhost:3000/HostedListings')
    // Menu top right visible again
    cy.get('#sideButton').should('be.visible')
    cy.get('button[name="bookingHistoryBtn"]').click()
    cy.get('button[name="accept"]').click()
  })

  it('should logs in to main user successfully', () => {
    cy.get('#sideButton').click()
    cy.get('#logoutButton').click()

    cy.wait(2000)
    // Should be back to landing page
    cy.url().should('include', 'localhost:3000')
    // The menu icon should also not exist anymore.
    cy.get('#sideButton').should('not.exist')
    cy.get('button[name="signInButton"').click()
    cy.url().should('include', 'localhost:3000/login')
    cy.get('#email').focus().type('mainuser@gmail.com')
    cy.get('#password').focus().type('mainuser')

    cy.get('button[name="submit"]').click()

    cy.get('#goHomeButton').click()
  })

  // write review for accept booking
  it('should write review for accepted listing', () => {
    cy.get('input[name="searchBox"]').focus().type('listing')
    cy.get('button[name="searchBoxAction"]').click()
    cy.wait(2000)
    cy.get('.MuiCardActionArea-root').click()
    cy.wait(2000)
    cy.get('#viewAllReviewBtn').click()
    cy.wait(2000)
    cy.get('button[name="openWriteReview"]').click()
    cy.get('#writeReviewTextfield').focus().type('too bad')
    cy.get('#submitReview').click()
    cy.get('.MuiListItem-root').should('have.length', 1)
    cy.get('#closeReview').click()
  })

  // logout successful
  it('should logs out successfully', () => {
    cy.get('#sideButton').click()
    cy.get('#logoutButton').click()
    cy.wait(2000)
    // Should be back to landing page
    cy.url().should('include', 'localhost:3000')
    // The menu icon should also not exist anymore.
    cy.get('#sideButton').should('not.exist')
  })
})
