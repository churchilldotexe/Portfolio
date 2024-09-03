// TODO:
// make sure to have a check for your scope params when you receive in case the user change it.
// try REDIS for the in:memory unguessable state or do the http only cookie if you cant for the STATE
// dont forget to remove the state from the HTTP ONLY COOKIES after authentication
// check the database first if the user email/profile is already in the DB if already exist get the Refreshtoken
// if no refresh token and/or invalid refresh token create a new one with a useridentifier (uuid perhaps )
// then write the shortlived to the http only cookie
// find out about the versioning that was mentioned
