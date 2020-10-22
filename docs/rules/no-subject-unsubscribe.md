# Avoid calling `unsubscribe` on subjects (`no-subject-unsubscribe`)

This rule effects failures if the `unsubscribe` method is called on subjects. The method behaves differently to the `unsubsribe` method on subscriptions and is often an error.

## Options

This rule has no options.

## Further reading

- [Closed Subjects](https://ncjamieson.com/closed-subjects/)