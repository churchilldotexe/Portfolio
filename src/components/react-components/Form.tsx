export default function Form() {
  return (
    <form>
      <fieldset>
        <label htmlFor="name">Project Name</label>
        <input id="name" type="text" />
      </fieldset>
      <fieldset>
        <label htmlFor="image">Project Image</label>
        <input id="image" type="file" />
      </fieldset>
      <fieldset>
        <label htmlFor="description">Project Description</label>
        <input id="description" type="text" />
      </fieldset>
      <fieldset>
        <label htmlFor="repository">Project Name</label>
        <input id="repository" type="text" />
      </fieldset>
      <fieldset>
        <label htmlFor="site">Project Name</label>
        <input id="site" type="text" />
      </fieldset>
    </form>
  );
}
