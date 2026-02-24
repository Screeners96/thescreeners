import { cmsClient } from "./sanity"


export async function updateArchiveStatus() {
  try {

    const now = new Date().toISOString()

    
    const articlesToArchive = await cmsClient.fetch(
      `
      *[_type == "article" && defined(moveToArchiveDate) && moveToArchiveDate < $now && (isArchived != true)] {
        _id
      }
    `,
      { now },
    )


    for (const article of articlesToArchive) {
      await cmsClient.patch(article._id).set({ isArchived: true }).commit()

    }

    return {
      success: true,
      archivedCount: articlesToArchive.length,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}
