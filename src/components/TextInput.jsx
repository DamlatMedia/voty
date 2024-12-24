import style from "../student/studentStyles/authentication.module.css";

function TextInput({ field, form, type, name, placeholder, ariaLabel }) {
    const inputStyle = {
      padding: "10px",
      fontSize: "16px",
      borderRadius: "5px",
    };
  
    const error = form.touched[field.name] && form.errors[field.name];

    return (
      <div>
        <input
          {...field} // Includes `name`, `value`, and `onChange`
          type={type}
          id={name} // Use `name` as `id` for accessibility
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={style.input || ""}
          style={style.input ? null : inputStyle}
        />
       {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    );
  }

  export default TextInput