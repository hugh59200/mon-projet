import type { Meta, StoryObj } from '@storybook/vue3'
import BasicPagination from './BasicPagination.vue'
import { ref } from 'vue'

const meta: Meta<typeof BasicPagination> = {
  title: 'Composants/Pagination',
  component: BasicPagination,
}

export default meta

type Story = StoryObj<typeof meta>

export const ParDéfaut: Story = {
  render: (args) => ({
    components: { BasicPagination },
    setup() {
      const currentPage = ref(args.currentPage || 1)

      const handleChangePage = (page: number) => {
        currentPage.value = page
      }

      return { args, currentPage, handleChangePage }
    },
    template: `
      <div>
        <Pagination
          :nbPages="args.nbPages"
          :currentPage

          :nbPagesMax="args.nbPagesMax"
          @change="handleChangePage"
        />
        <p>Page actuelle : {{ currentPage }}</p>
      </div>
    `,
  }),
  args: {
    nbPages: 15,
    currentPage: 1,
    nbPagesMax: 10,
  },
}
