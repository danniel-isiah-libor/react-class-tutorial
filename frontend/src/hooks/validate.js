export const useValidate = () => {
  const validate = async ({ schema, setError, ...props }) => {
    return schema.validate(props, { abortEarly: false })
      .then(() => true)
      .catch((err) => {
        err.inner.map((v) => setError((prev) => ({ ...prev, [v.path]: [v.message] })))

        return false
      })
  }

  return {
    validate
  }
}
