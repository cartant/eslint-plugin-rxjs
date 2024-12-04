import { TSESLint } from '@typescript-eslint/utils';
import { name, version } from '../package.json';
import { createRecommendedConfig } from './configs/recommended';
import { createStrictConfig } from './configs/strict';

import { banObservablesRule } from './rules/ban-observables';
import { banOperatorsRule } from './rules/ban-operators';
import { finnishRule } from './rules/finnish';
import { justRule } from './rules/just';
import { macroRule } from './rules/macro';
import { noAsyncSubscribeRule } from './rules/no-async-subscribe';
import { noCompatRule } from './rules/no-compat';
import { noConnectableRule } from './rules/no-connectable';
import { noCreateRule } from './rules/no-create';
import { noCyclicActionRule } from './rules/no-cyclic-action';
import { noExplicitGenericsRule } from './rules/no-explicit-generics';
import { noExposedSubjectsRule } from './rules/no-exposed-subjects';
import { noFinnishRule } from './rules/no-finnish';
import { noFloatingObservablesRule } from './rules/no-floating-observables';
import { noIgnoredDefaultValueRule } from './rules/no-ignored-default-value';
import { noIgnoredErrorRule } from './rules/no-ignored-error';
import { noIgnoredNotifierRule } from './rules/no-ignored-notifier';
import { noIgnoredReplayBufferRule } from './rules/no-ignored-replay-buffer';
import { noIgnoredSubscribeRule } from './rules/no-ignored-subscribe';
import { noIgnoredSubscriptionRule } from './rules/no-ignored-subscription';
import { noIgnoredTakewhileValueRule } from './rules/no-ignored-takewhile-value';
import { noImplicitAnyCatchRule } from './rules/no-implicit-any-catch';
import { noIndexRule } from './rules/no-index';
import { noInternalRule } from './rules/no-internal';
import { noMisusedObservablesRule } from './rules/no-misused-observables';
import { noNestedSubscribeRule } from './rules/no-nested-subscribe';
import { noRedundantNotifyRule } from './rules/no-redundant-notify';
import { noSharereplayRule } from './rules/no-sharereplay';
import { noSubclassRule } from './rules/no-subclass';
import { noSubjectUnsubscribeRule } from './rules/no-subject-unsubscribe';
import { noSubjectValueRule } from './rules/no-subject-value';
import { noSubscribeHandlersRule } from './rules/no-subscribe-handlers';
import { noSubscribeInPipeRule } from './rules/no-subscribe-in-pipe';
import { noTapRule } from './rules/no-tap';
import { noTopromiseRule } from './rules/no-topromise';
import { noUnboundMethodsRule } from './rules/no-unbound-methods';
import { noUnsafeCatchRule } from './rules/no-unsafe-catch';
import { noUnsafeFirstRule } from './rules/no-unsafe-first';
import { noUnsafeSubjectNext } from './rules/no-unsafe-subject-next';
import { noUnsafeSwitchmapRule } from './rules/no-unsafe-switchmap';
import { noUnsafeTakeuntilRule } from './rules/no-unsafe-takeuntil';
import { preferObserverRule } from './rules/prefer-observer';
import { preferRootOperatorsRule } from './rules/prefer-root-operators';
import { suffixSubjectsRule } from './rules/suffix-subjects';
import { throwErrorRule } from './rules/throw-error';

const plugin = {
  meta: { name, version },
  rules: {
    'ban-observables': banObservablesRule,
    'ban-operators': banOperatorsRule,
    'finnish': finnishRule,
    'just': justRule,
    'macro': macroRule,
    'no-async-subscribe': noAsyncSubscribeRule,
    'no-compat': noCompatRule,
    'no-connectable': noConnectableRule,
    'no-create': noCreateRule,
    'no-cyclic-action': noCyclicActionRule,
    'no-explicit-generics': noExplicitGenericsRule,
    'no-exposed-subjects': noExposedSubjectsRule,
    'no-finnish': noFinnishRule,
    'no-floating-observables': noFloatingObservablesRule,
    'no-ignored-default-value': noIgnoredDefaultValueRule,
    'no-ignored-error': noIgnoredErrorRule,
    'no-ignored-notifier': noIgnoredNotifierRule,
    'no-ignored-replay-buffer': noIgnoredReplayBufferRule,
    'no-ignored-subscribe': noIgnoredSubscribeRule,
    'no-ignored-subscription': noIgnoredSubscriptionRule,
    'no-ignored-takewhile-value': noIgnoredTakewhileValueRule,
    'no-implicit-any-catch': noImplicitAnyCatchRule,
    'no-index': noIndexRule,
    'no-internal': noInternalRule,
    'no-misused-observables': noMisusedObservablesRule,
    'no-nested-subscribe': noNestedSubscribeRule,
    'no-redundant-notify': noRedundantNotifyRule,
    'no-sharereplay': noSharereplayRule,
    'no-subclass': noSubclassRule,
    'no-subject-unsubscribe': noSubjectUnsubscribeRule,
    'no-subject-value': noSubjectValueRule,
    'no-subscribe-handlers': noSubscribeHandlersRule,
    'no-subscribe-in-pipe': noSubscribeInPipeRule,
    'no-tap': noTapRule,
    'no-topromise': noTopromiseRule,
    'no-unbound-methods': noUnboundMethodsRule,
    'no-unsafe-catch': noUnsafeCatchRule,
    'no-unsafe-first': noUnsafeFirstRule,
    'no-unsafe-subject-next': noUnsafeSubjectNext,
    'no-unsafe-switchmap': noUnsafeSwitchmapRule,
    'no-unsafe-takeuntil': noUnsafeTakeuntilRule,
    'prefer-observer': preferObserverRule,
    'prefer-root-operators': preferRootOperatorsRule,
    'suffix-subjects': suffixSubjectsRule,
    'throw-error': throwErrorRule,
  },
} satisfies TSESLint.FlatConfig.Plugin;

const rxjsX = {
  ...plugin,
  configs: {
    recommended: createRecommendedConfig(plugin),
    strict: createStrictConfig(plugin),
  },
} satisfies TSESLint.FlatConfig.Plugin;

export default rxjsX;
