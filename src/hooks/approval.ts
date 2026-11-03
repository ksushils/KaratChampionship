import { APIError, type CollectionBeforeChangeHook } from 'payload'
import { isAdmin } from '../access/roles'

/**
 * CMS-04 / NEWS-12: content can only be published once its editorial status is "approved".
 * Approval itself is restricted to administrators (field-level access on `editorialStatus`).
 */
export const requireApprovalToPublish: CollectionBeforeChangeHook = ({ data, req, originalDoc }) => {
  const publishing = data._status === 'published' && originalDoc?._status !== 'published'
  if (!publishing) return data
  if (req.context?.seed) return data
  const editorial = data.editorialStatus ?? originalDoc?.editorialStatus
  if (editorial !== 'approved' && !isAdmin(req.user as never)) {
    throw new APIError('This item must be approved before it can be published. Ask an administrator to set Editorial status to "Approved".', 400)
  }
  return data
}

/** DRV-16: minors' profiles need documented guardian/media approval before publication. */
export const requireMinorConsent: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const merged = { ...originalDoc, ...data }
  if (merged._status === 'published' && merged.isMinor && !(merged.safeguarding?.guardianConsentRecorded && merged.safeguarding?.mediaConsentRecorded)) {
    throw new APIError('This driver is a minor: record guardian consent and media consent (Safeguarding tab) before publishing.', 400)
  }
  return data
}
